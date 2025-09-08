import { getHome, putHome } from '@/lib/home/fileStore'
import { moveWidget, pinWidget, removeWidget, resizeWidget, togglePinWidget, upsertWidgetData } from '@/lib/home/pureStore'
import { safeParseHome, zHomePatch, zPos, zSize } from '@/lib/home/schema'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const doc = await getHome(params.id)
  if (!doc) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })
  return NextResponse.json({ ok: true, doc }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null)
  const parsed = safeParseHome(body)
  if (!parsed.success || parsed.data.id !== params.id) {
    return NextResponse.json({ ok: false, error: 'bad payload' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }
  const saved = await putHome(parsed.data)
  return NextResponse.json({ ok: true, doc: saved }, { headers: { 'Cache-Control': 'no-store' } })
}

// PATCH: partial updates for a single widget (position, size, pinned, data)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const home = await getHome(params.id)
  if (!home) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })

  const body = await req.json().catch(() => null as any)

  // New shape (Wave 12.2): { widgets: [{ id, size?, pos?, pinned?, data? }] }
  if (body && Array.isArray(body.widgets)) {
    const parsed = zHomePatch.safeParse(body)
    if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400, headers: { 'Cache-Control': 'no-store' } })

    let next = { ...home, widgets: [...home.widgets] }
    for (const patch of parsed.data.widgets) {
      const w = next.widgets.find(x => x.id === patch.id)
      if (!w) continue
      if (patch.pos) next = moveWidget(next, patch.id, patch.pos)
      if (patch.size) next = resizeWidget(next, patch.id, patch.size)
      if (typeof patch.pinned === 'boolean') {
        const current = !!w.pinned
        if (current !== patch.pinned) {
          // pinWidget toggles; call only when different
          next = pinWidget(next, patch.id)
        }
      }
      if (patch.data) next = upsertWidgetData(next, patch.id, patch.data as Record<string, unknown>)
    }

    const saved = await putHome(next)
    const payload = JSON.stringify({ ok: true, doc: saved })
    const etag = 'W/"' + crypto.createHash('sha1').update(payload).digest('hex') + '"'
    return new NextResponse(payload, { headers: { 'content-type': 'application/json', 'Cache-Control': 'no-store', ETag: etag } })
  }

  // Back-compat shape: { widgetId, pos?, size?, pin?, remove?, data? }
  const widgetId = typeof body?.widgetId === 'string' && body.widgetId.length > 0 ? body.widgetId : null
  if (!widgetId) {
    return NextResponse.json({ ok: false, error: 'bad payload' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }

  let next = home
  if (body?.remove === true) {
    next = removeWidget(next, widgetId)
  }
  if (body?.pin === true || body?.pin === false || typeof body?.pin === 'boolean') {
    next = togglePinWidget(next, widgetId)
  }
  if (body?.pos) {
    const parsed = zPos.safeParse(body.pos)
    if (!parsed.success) return NextResponse.json({ ok: false, error: 'bad pos' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
    next = moveWidget(next, widgetId, parsed.data)
  }
  if (body?.size) {
    const parsed = zSize.safeParse(body.size)
    if (!parsed.success) return NextResponse.json({ ok: false, error: 'bad size' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
    next = resizeWidget(next, widgetId, parsed.data)
  }
  if (body?.data && typeof body.data === 'object') {
    next = upsertWidgetData(next, widgetId, body.data)
  }

  const saved = await putHome(next)
  const payload = JSON.stringify({ ok: true, doc: saved })
  const etag = 'W/"' + crypto.createHash('sha1').update(payload).digest('hex') + '"'
  return new NextResponse(payload, { headers: { 'content-type': 'application/json', 'Cache-Control': 'no-store', ETag: etag } })
}




