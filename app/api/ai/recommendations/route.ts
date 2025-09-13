import { getRecommendations } from '@/lib/home/recommend'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const doc = String(searchParams.get('doc') || 'default')
  const limit = Math.max(1, Math.min(10, Number(searchParams.get('limit') || '3')))
  const items = await getRecommendations(doc, limit)
  return NextResponse.json({ updatedAt: new Date().toISOString(), items }, { headers: { 'Cache-Control': 'no-store' } })
}


