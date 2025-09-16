import { listSignals, logSignal } from '@/lib/home/signals'
import type { HomeSignal } from '@/lib/home/types'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const zSignal = z.object({
  id: z.string().min(1),
  ts: z.number().int().positive(),
  kind: z.enum(['pin','unpin','move','resize','refresh','settings','open','collapse','expand','undo','redo','snapshot.save','snapshot.restore','snapshot.delete']),
  docId: z.string().min(1),
  sectionId: z.string().min(1).optional(),
  widgetId: z.string().min(1).optional(),
  pos: z.object({ x: z.number().int().min(0), y: z.number().int().min(0) }).optional(),
  size: z.object({ w: z.number().int().min(1), h: z.number().int().min(1) }).optional(),
  meta: z.record(z.unknown()).optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const parsed = zSignal.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'bad-payload' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  try {
    await logSignal(parsed.data as HomeSignal)
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'signals-failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ ok: false }, { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }
  const { searchParams } = new URL(req.url)
  const limit = Math.max(1, Math.min(1000, Number(searchParams.get('limit') || '100')))
  const sinceMs = searchParams.get('sinceMs') ? Number(searchParams.get('sinceMs')) : undefined
  const items = await listSignals({ sinceMs })
  return NextResponse.json(items.slice(-limit), { headers: { 'Cache-Control': 'no-store' } })
}


