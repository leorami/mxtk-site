import { NextRequest, NextResponse } from 'next/server'
import { getOrSet } from '@/lib/server/cache'
import { getPriceSeries } from '@/lib/data/sources'

export const revalidate = 0

export async function GET(req: NextRequest, { params }: { params: { symbol: string } }) {
  const symbol = (params?.symbol || 'MXTK').toUpperCase()
  const url = new URL(req.url)
  const daysParam = url.searchParams.get('days')
  const days = Math.max(1, Math.min(365, Number(daysParam) || 30))
  const key = `prices:${symbol}:${days}`
  const series = await getOrSet(key, 300_000, () => getPriceSeries(symbol, days))
  return NextResponse.json({ symbol, days, series })
}


