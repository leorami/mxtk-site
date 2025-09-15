// app/api/ai/home/[id]/snapshots/route.ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { listSnapshots, saveSnapshot } from '@/lib/home/store/snapshotStore'
import { getHome } from '@/lib/home/store/fileStore'
import { migrateToV2 } from '@/lib/home/migrate'

const NO_STORE = { 'Cache-Control': 'no-store' }

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  try {
    const items = await listSnapshots(id || 'default')
    return NextResponse.json({ items }, { headers: NO_STORE })
  } catch (e: any) {
    const detail = e?.stack || e?.message || String(e)
    return NextResponse.json({ error: 'snapshots-list-failed', detail }, { status: 500, headers: NO_STORE })
  }
}

const zCreate = z.object({ note: z.string().max(200).optional() })

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  try {
    const body = await req.json().catch(() => ({}))
    const parsed = zCreate.safeParse(body || {})
    if (!parsed.success) {
      return NextResponse.json({ error: 'bad-body', detail: parsed.error.flatten() }, { status: 400, headers: NO_STORE })
    }
    const raw = await getHome(id || 'default')
    if (!raw) return NextResponse.json({ error: 'not-found' }, { status: 404, headers: NO_STORE })
    const { doc } = migrateToV2(raw)
    const meta = await saveSnapshot(doc, { note: parsed.data.note })
    return NextResponse.json({ ok: true, meta }, { headers: NO_STORE })
  } catch (e: any) {
    const detail = e?.stack || e?.message || String(e)
    return NextResponse.json({ error: 'snapshot-create-failed', detail }, { status: 500, headers: NO_STORE })
  }
}


