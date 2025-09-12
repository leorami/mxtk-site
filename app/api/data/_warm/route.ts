import { getPools as getPoolsFromSources, getPriceSeries } from '@/lib/data/sources'
import { NextResponse } from 'next/server'

export const revalidate = 0

function isAuthorized(req: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  const auth = req.headers.get('authorization') || ''
  const expected = process.env.ADMIN_TOKEN ? `Bearer ${process.env.ADMIN_TOKEN}` : ''
  return expected !== '' && auth === expected
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const envTokens = (process.env.MXTK_WARM_TOKENS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  const qTokens = url.searchParams.getAll('token').map(s => s.trim()).filter(Boolean)
  const list = qTokens.length ? qTokens : envTokens

  const results: Array<any> = []
  for (const t of list) {
    try {
      const pools = await getPoolsFromSources(t).catch(() => [])
      const price = await getPriceSeries('MXTK', 30).catch(() => ({ points: [] }))
      results.push({ token: t, pools: Array.isArray(pools) ? pools.length : 0, pricePoints: Array.isArray((price as any).points) ? (price as any).points.length : 0 })
    } catch {
      results.push({ token: t, error: true })
    }
  }

  return NextResponse.json({ warmed: results, at: Date.now() })
}


