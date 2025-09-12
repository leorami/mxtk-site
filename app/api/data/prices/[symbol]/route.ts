import { getPriceSeries } from '@/lib/data/sources'
import { getOrSet, getRemainingTtlMs } from '@/lib/server/cache'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function GET(req: NextRequest, { params }: { params: { symbol: string } }) {
  const symbol = (params?.symbol || 'MXTK').toUpperCase()
  const url = new URL(req.url)
  const daysParam = url.searchParams.get('days')
  const days = Math.max(1, Math.min(365, Number(daysParam) || 30))
  const key = `prices:${symbol}:${days}`
  try {
    const ttlMs = 300_000
    const series = await getOrSet(key, ttlMs, () => getPriceSeries(symbol, days))
    const remaining = getRemainingTtlMs(key)
    return NextResponse.json({ updatedAt: Date.now() - Math.max(0, ttlMs - remaining), ttl: remaining, data: { symbol, days, series } })
  } catch {
    return NextResponse.json({ updatedAt: Date.now(), ttl: 0, data: { symbol, days, series: { points: [] } } })
  }
}


