// app/api/ai/home/[id]/snapshots/[sid]/route.ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { deleteSnapshot, loadSnapshot, restoreSnapshot } from '@/lib/home/store/snapshotStore'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const NO_STORE = { 'Cache-Control': 'no-store' }

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string; sid: string }> }) {
  const { id, sid } = await ctx.params
  try {
    const ok = await deleteSnapshot(id || 'default', sid)
    return NextResponse.json({ ok: !!ok }, { headers: NO_STORE })
  } catch (e: any) {
    const detail = e?.stack || e?.message || String(e)
    return NextResponse.json({ error: 'snapshot-delete-failed', detail }, { status: 500, headers: NO_STORE })
  }
}

const zAction = z.object({ action: z.literal('restore') })

export async function POST(req: Request, ctx: { params: Promise<{ id: string; sid: string }> }) {
  const { id, sid } = await ctx.params
  try {
    const body = await req.json().catch(() => ({}))
    const parsed = zAction.safeParse(body || {})
    if (!parsed.success) {
      return NextResponse.json({ error: 'bad-body', detail: parsed.error.flatten() }, { status: 400, headers: NO_STORE })
    }
    // Ensure snapshot exists
    const snap = await loadSnapshot(id || 'default', sid)
    if (!snap) return NextResponse.json({ error: 'not-found' }, { status: 404, headers: NO_STORE })
    const doc = await restoreSnapshot(id || 'default', sid)
    if (!doc) return NextResponse.json({ error: 'restore-failed' }, { status: 500, headers: NO_STORE })
    return NextResponse.json({ ok: true, doc }, { headers: NO_STORE })
  } catch (e: any) {
    const detail = e?.stack || e?.message || String(e)
    return NextResponse.json({ error: 'snapshot-restore-failed', detail }, { status: 500, headers: NO_STORE })
  }
}


