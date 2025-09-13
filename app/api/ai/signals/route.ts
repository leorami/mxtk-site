import { append } from '@/lib/signals/store'
import type { Signal } from '@/lib/signals/types'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const signals = Array.isArray(body?.signals) ? (body.signals as Signal[]) : []
    // Stamp ts if missing and coerce basic shape
    const now = Date.now()
    const sanitized: Signal[] = signals.map(s => ({
      ts: Number(s?.ts) || now,
      user: typeof s?.user === 'string' ? s.user : undefined,
      homeId: String(s?.homeId || 'default'),
      widgetId: s?.widgetId ? String(s.widgetId) : undefined,
      type: String(s?.type) as any,
      payload: (s && typeof s.payload === 'object') ? s.payload as any : undefined,
    }))
    if (sanitized.length) await append(sanitized)
    return NextResponse.json({ ok: true, count: sanitized.length }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'signals-failed', detail: e?.message || String(e) }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}


