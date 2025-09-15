import { getPriceSeries } from '@/lib/data/sources'
import { getOrSet, getRemainingTtlMs } from '@/lib/server/cache'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function GET(req: NextRequest, ctx: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = await ctx.params
  const symbol = (rawSymbol || 'MXTK').toUpperCase()
  const url = new URL(req.url)
  const daysParam = url.searchParams.get('days')
  const days = Math.max(1, Math.min(365, Number(daysParam) || 30))
  const key = `prices:${symbol}:${days}`
  try {
    const ttlMs = 300_000
    const series = await getOrSet(key, ttlMs, () => getPriceSeries(symbol, days))
    const remaining = getRemainingTtlMs(key)
    const updatedAt = Date.now() - Math.max(0, ttlMs - remaining)
    const source = (series as any)?.source || 'fixture'
    return NextResponse.json({ updatedAt, ttl: remaining, source, data: { symbol, days, series } })
  } catch {
    // Dev-friendly mock sparkline (flat-ish) to ensure UI shows content
    const now = Date.now()
    const points = Array.from({ length: Math.min(60, days * 8) }, (_, i) => ({ time: now - (pointsBase(days) * (pointsLen(days) - i)), value: 1 + Math.sin(i / 6) * 0.05 }))
    return NextResponse.json({ updatedAt: Date.now(), ttl: 0, source: 'fallback', data: { symbol, days, series: { points } } })
  }
}

function pointsBase(days: number) { return Math.max(60_000, Math.floor((days * 24 * 60 * 60 * 1000) / Math.max(10, days * 8))) }
function pointsLen(days: number) { return Math.min(60, days * 8) }


