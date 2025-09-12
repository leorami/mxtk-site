import { Pool, PoolStats, TokenRef } from '@/lib/data/types'
import { env } from '@/lib/env'

type GraphQlResponse<T> = { data?: T }

async function gql<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const url = env.UNISWAP_V4_SUBGRAPH_URL_ARBITRUM || process.env.UNISWAP_V4_SUBGRAPH_URL || ''
  if (!url) throw new Error('UNISWAP_V4_SUBGRAPH_URL not configured')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`subgraph http ${res.status}`)
  const json = (await res.json()) as GraphQlResponse<T>
  if (!json || !json.data) throw new Error('subgraph empty data')
  return json.data
}

// Best-effort mapping helpers (schema differences tolerated)
function toTokenRef(t: any): TokenRef {
  return {
    address: (t?.id || t?.address || '').toLowerCase(),
    symbol: t?.symbol || '',
    decimals: Number(t?.decimals ?? 18),
  }
}

export async function discoverPools(factoryAddress: string): Promise<Pool[]> {
  try {
    if (!factoryAddress) throw new Error('factory address required')
    const data = await gql<{ pools: any[] }>(
      `query($factory: String!) {
        pools(first: 200, where: { factory: $factory }) {
          id
          feeTier
          token0 { id symbol decimals }
          token1 { id symbol decimals }
        }
      }`,
      { factory: factoryAddress.toLowerCase() },
    )
    const pools = (data?.pools || []).map((p) => ({
      address: (p?.id || '').toLowerCase(),
      fee: p?.feeTier != null ? Number(p.feeTier) : undefined,
      token0: toTokenRef(p?.token0),
      token1: toTokenRef(p?.token1),
    })) as Pool[]
    return pools
  } catch {
    return []
  }
}

export async function readPoolStats(poolAddress: string): Promise<PoolStats> {
  try {
    if (!poolAddress) throw new Error('pool address required')
    const data = await gql<{ pool?: any }>(
      `query($id: String!) {
        pool(id: $id) {
          id
          totalValueLockedUSD
          volumeUSD24h: volumeUSD24h
          feesUSD24h: feesUSD24h
          feeTier
        }
      }`,
      { id: poolAddress.toLowerCase() },
    )
    const p = (data as any)?.pool
    if (!p) return { tvlUSD: null, volume24hUSD: null, fees24hUSD: null }
    const tvl = num(p.totalValueLockedUSD)
    const vol = num(p.volumeUSD24h)
    let fees = num(p.feesUSD24h)
    if (fees == null && vol != null && p?.feeTier != null) {
      const bps = Number(p.feeTier)
      if (isFinite(bps)) fees = (vol || 0) * (bps / 10_000)
    }
    return {
      tvlUSD: tvl,
      volume24hUSD: vol,
      fees24hUSD: fees,
    }
  } catch {
    return { tvlUSD: null, volume24hUSD: null, fees24hUSD: null }
  }
}

function num(v: any): number | null {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}


