import { ensureHome, getHome, putHome } from '@/lib/home/fileStore'
import { ensureWidget } from '@/lib/home/pureStore'
import { safeParseWidgetAdd } from '@/lib/home/schema'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any))
  const parsed = safeParseWidgetAdd(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'bad payload' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })

  let homeId = parsed.data.homeId
  const store = cookies()
  if (!homeId) {
    homeId = (globalThis.crypto?.randomUUID?.() ?? 'h_' + Math.random().toString(36).slice(2))
    // httpOnly false to let Next middleware read it? Keep SameSite Lax, Secure on https
    const isHttps = (process.env.NEXT_PUBLIC_SITE_ORIGIN || '').startsWith('https://')
    store.set('mxtk_home_id', homeId, { path: '/', sameSite: 'Lax', secure: isHttps })
  }

  const incoming = parsed.data.widget
  const size = incoming.size || { w: 4, h: 3 }

  const base = (await getHome(homeId)) || (await ensureHome(homeId))

  // De-dupe within 30s by (type, title)
  const now = Date.now()
  const recent = base.widgets.find(w => w.type === incoming.type && (!incoming.title || w.title === incoming.title) && w.createdAt && now - Date.parse(w.createdAt) <= 30_000)
  if (recent) {
    return NextResponse.json({ ok: true, homeId, widget: recent }, { headers: { 'Cache-Control': 'no-store' } })
  }

  // Use ensureWidget to prevent duplicates by type and merge data
  const next = ensureWidget(base as any, { type: incoming.type as any, title: incoming.title, size: size as any, data: incoming.data as any }) as any
  await putHome(next)
  const added = next.widgets[next.widgets.length - 1]

  return new NextResponse(JSON.stringify({ ok: true, homeId, widget: added }), {
    headers: { 'content-type': 'application/json', 'Cache-Control': 'no-store' },
  })
}




