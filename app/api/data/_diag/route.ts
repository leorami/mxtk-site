import { NextResponse } from 'next/server'
import { getRemainingTtlMs, listKeys, getCapacity } from '@/lib/server/cache'

export const revalidate = 0

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const keys = listKeys()
  const items = keys.map((k) => ({ key: k, remainingMs: getRemainingTtlMs(k) }))
  return NextResponse.json({ size: keys.length, capacity: getCapacity(), items })
}


