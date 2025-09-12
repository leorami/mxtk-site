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
    const data = await getOrSet(key, ttlMs, () => getPools(token))
    const remaining = getRemainingTtlMs(key)
    const envelope = { updatedAt: Date.now() - Math.max(0, ttlMs - remaining), ttl: remaining, data }
    return NextResponse.json(envelope)
  } catch {
    return NextResponse.json({ updatedAt: Date.now(), ttl: 0, data: [] })
  }
}


