import { getPoolsByToken } from '@/lib/data/adapters/dexscreener'
import { discoverPools, readPoolStats } from '@/lib/data/adapters/uniswapV4'
import { Pool, PoolRow, PoolSnapshot, PoolStats } from '@/lib/data/types'
import { env } from '@/lib/env'

function asRow(p: Pool, stats?: PoolStats): PoolRow {
  return {
    address: p.address,
    source: 'factory',
    fee: p.fee,
    token0: p.token0,
    token1: p.token1,
    approxMxtkUSD: null,
    volume24hUSD: stats?.volume24hUSD ?? null,
    fees24hUSD: stats?.fees24hUSD ?? null,
    tvlUSD: stats?.tvlUSD ?? null,
  }
}

function asRowFromSnapshot(s: PoolSnapshot): PoolRow {
  return {
    address: s.address,
    source: 'dexscreener',
    token0: s.token0,
    token1: s.token1,
    approxMxtkUSD: s.approxMxtkUSD ?? null,
    volume24hUSD: s.volume24hUSD ?? null,
    fees24hUSD: s.fees24hUSD ?? null,
    tvlUSD: s.tvlUSD ?? null,
  }
}

export async function getPools(tokenAddress: string): Promise<PoolRow[]> {
  const token = (tokenAddress || env.MXTK_TOKEN_ADDRESS || '').toLowerCase()
  if (!token) return []

  // Try Uniswap factory discovery first
  try {
    const factory = process.env.UNISWAP_V4_FACTORY || ''
    const pools = await discoverPools(factory)
    const filtered = pools.filter(p => p.token0.address === token || p.token1.address === token)
    // Best-effort stats in parallel but with guard
    const rows: PoolRow[] = []
    if (filtered.length) {
      const statsList = await Promise.all(filtered.map(async (p) => {
        const stats = await readPoolStats(p.address)
        return asRow(p, stats)
      }))
      rows.push(...statsList)
    }
    if (rows.length) return rows
  } catch {}

  // Fallback to Dexscreener
  try {
    const snaps = await getPoolsByToken(token)
    return snaps.map(asRowFromSnapshot)
  } catch {
    return []
  }
}


