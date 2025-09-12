import { NextResponse } from 'next/server'
import { getOrSet } from '@/lib/server/cache'
import { getPools } from '@/lib/data/sources'

export const revalidate = 0

export async function GET() {
  const pools = await getOrSet('pools', 60_000, getPools)
  return NextResponse.json({ pools })
}


