import { getCapacity, getRemainingTtlMs, listKeys } from '@/lib/server/cache'
import { NextResponse } from 'next/server'

export const revalidate = 0

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const keys = listKeys()
  const items = keys.map((k) => ({ key: k, remainingMs: getRemainingTtlMs(k) }))
  return NextResponse.json({ size: keys.length, capacity: getCapacity(), items })
}


