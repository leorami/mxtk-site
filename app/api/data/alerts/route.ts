import { FRESHNESS, freshness } from '@/lib/data/policy'
import { getPools as getPoolsFromSources, getPriceSeries } from '@/lib/data/sources'
import { NextResponse } from 'next/server'

export const revalidate = 0

function isAuthorized(req: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  const auth = req.headers.get('authorization') || ''
  const expected = process.env.ADMIN_TOKEN ? `Bearer ${process.env.ADMIN_TOKEN}` : ''
  return expected !== '' && auth === expected
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const token = url.searchParams.get('token') || process.env.MXTK_PRIMARY_TOKEN || ''

  const alerts: any[] = []

  try {
    const pools = await getPoolsFromSources(token)
    const poolsUpd = Date.now()
    const pState = freshness(poolsUpd, FRESHNESS.pools.warnMs)
    if (!Array.isArray(pools) || pools.length === 0) {
      alerts.push({ level: 'warn', code: 'pools.empty', message: 'No pools discovered', meta: { token } })
    }
    if (pState !== 'fresh') {
      alerts.push({ level: pState === 'stale' ? 'warn' : 'error', code: `pools.${pState}`, message: `Pools data ${pState}`, meta: { token } })
    }
  } catch {
    alerts.push({ level: 'error', code: 'pools.fetch', message: 'Pools fetch failed', meta: { token } })
  }

  try {
    const price = await getPriceSeries('MXTK', 30)
    const end = (price as any)?.end || Date.now()
    const s = freshness(end, FRESHNESS.prices.warnMs)
    if (s !== 'fresh') {
      alerts.push({ level: s === 'stale' ? 'warn' : 'error', code: `price.${s}`, message: `Price series ${s}`, meta: { updatedAt: end } })
    }
  } catch {
    alerts.push({ level: 'error', code: 'price.fetch', message: 'Price fetch failed' })
  }

  return NextResponse.json({ alerts, at: Date.now() })
}


