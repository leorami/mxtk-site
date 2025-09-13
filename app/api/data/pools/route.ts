import { getPools } from '@/lib/data/pools'
import { getOrSet, getRemainingTtlMs } from '@/lib/server/cache'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const token = (url.searchParams.get('token') || '').toLowerCase()
    const key = `pools:${token}`
    const ttlMs = 60_000
    const data = await getOrSet(key, ttlMs, async () => {
      const rows = await getPools(token)
      if (rows.length) return rows
      // Dev-friendly mock to ensure UI shows content when adapters are offline
      if (!token) {
        return []
      }
      return [
        { address: '0xpool1', source: 'mock', token0: { symbol: 'MXTK', address: '0x', decimals: 18 }, token1: { symbol: 'USDC', address: '0x', decimals: 6 }, tvlUSD: 1234567, volume24hUSD: 45678 },
        { address: '0xpool2', source: 'mock', token0: { symbol: 'MXTK', address: '0x', decimals: 18 }, token1: { symbol: 'ETH', address: '0x', decimals: 18 }, tvlUSD: 987654, volume24hUSD: 12345 },
        { address: '0xpool3', source: 'mock', token0: { symbol: 'MXTK', address: '0x', decimals: 18 }, token1: { symbol: 'DAI', address: '0x', decimals: 18 }, tvlUSD: 345678, volume24hUSD: 6789 },
      ] as any
    })
    const remaining = getRemainingTtlMs(key)
    const updatedAt = Date.now() - Math.max(0, ttlMs - remaining)
    const source = Array.isArray(data) && data.length ? (data[0]?.source || 'unknown') : 'fallback'
    const envelope = { updatedAt, ttl: remaining, source, data }
    return NextResponse.json(envelope)
  } catch {
    return NextResponse.json({ updatedAt: Date.now(), ttl: 0, source: 'fallback', data: [] })
  }
}


