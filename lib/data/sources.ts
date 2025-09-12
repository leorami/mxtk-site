import { getPools as getLivePools } from '@/lib/data/pools'
import { readFile } from 'fs/promises'
import path from 'path'
import { PoolRow, Series } from './types'

const FIXTURES_DIR = path.resolve(process.cwd(), 'data', 'fixtures')

async function readJson<T>(fileName: string): Promise<T> {
  const filePath = path.join(FIXTURES_DIR, fileName)
  const buf = await readFile(filePath, 'utf-8')
  return JSON.parse(buf) as T
}

export async function getPools(token?: string): Promise<PoolRow[]> {
  // Try live pools if token provided; fall back to fixture
  if (token) {
    const live = await getLivePools(token).catch(() => [])
    if (Array.isArray(live) && live.length) return live
  }
  // Fixture fallback
  const data = await readJson<any>('pools.json').catch(() => ({ pools: [] }))
  if (Array.isArray(data)) return data as PoolRow[]
  return (data?.pools as PoolRow[]) || []
}

export async function getPriceSeries(symbol: string, days: number): Promise<Series> {
  const upper = (symbol || 'MXTK').toUpperCase()
  const file = `prices.${upper}.${days}.json`
  const series = await readJson<Series>(file).catch(() => ({ points: [] }))
  if (!series.points) return { points: [] }
  // Compute summary fields if absent
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  let start = series.points.length ? series.points[0].time : undefined
  let end = series.points.length ? series.points[series.points.length - 1].time : undefined
  for (const p of series.points) { if (p.value < min) min = p.value; if (p.value > max) max = p.value }
  return { ...series, min: isFinite(min) ? min : undefined, max: isFinite(max) ? max : undefined, start, end }
}

/*
TODO: Wire real data sources
- Uniswap v4 subgraph for pools, fees, volume, tvl
- CoinGecko or custom oracle for price series
- Add env-based switches and robust error handling
*/


