import { PoolSnapshot, TokenRef } from '@/lib/data/types'
import { env } from '@/lib/env'

type DexRes = {
  schemaVersion?: string
  pairs?: Array<{
    chainId?: string
    dexId?: string
    url?: string
    pairAddress?: string
    baseToken?: { address?: string; symbol?: string; decimals?: number }
    quoteToken?: { address?: string; symbol?: string; decimals?: number }
    priceUsd?: string | number
    liquidity?: { usd?: number }
    volume?: { h24?: number }
    txns?: { h24?: { buys?: number; sells?: number } }
    feeTier?: number
  }>
}

export async function getPoolsByToken(tokenAddress: string): Promise<PoolSnapshot[]> {
  try {
    const base = env.DEXSCREENER_BASE || process.env.DEXSCREENER_BASE || 'https://api.dexscreener.com/latest/dex'
    const url = `${base}/tokens/${encodeURIComponent(tokenAddress)}`
    const res = await fetch(url, { headers: { 'accept': 'application/json' } })
    if (!res.ok) throw new Error(`dexscreener http ${res.status}`)
    const json = (await res.json()) as DexRes
    const pairs = json?.pairs || []
    const out: PoolSnapshot[] = pairs.map((p) => {
      const t0: TokenRef = {
        address: (p.baseToken?.address || '').toLowerCase(),
        symbol: p.baseToken?.symbol || '',
        decimals: Number(p.baseToken?.decimals ?? 18),
      }
      const t1: TokenRef = {
        address: (p.quoteToken?.address || '').toLowerCase(),
        symbol: p.quoteToken?.symbol || '',
        decimals: Number(p.quoteToken?.decimals ?? 18),
      }
      const priceUsd = toNumber(p.priceUsd)
      const vol24 = toNumber(p.volume?.h24)
      const tvl = toNumber(p.liquidity?.usd)
      // fees rough estimate if feeTier present; otherwise null
      const fees24 = (vol24 != null && p.feeTier != null) ? vol24 * (Number(p.feeTier) / 10_000) : null
      return {
        address: (p.pairAddress || '').toLowerCase(),
        token0: t0,
        token1: t1,
        approxMxtkUSD: priceUsd,
        volume24hUSD: vol24,
        fees24hUSD: fees24,
        tvlUSD: tvl,
      }
    })
    return out
  } catch {
    return []
  }
}

function toNumber(v: any): number | null {
  const n = typeof v === 'string' ? Number(v) : (typeof v === 'number' ? v : NaN)
  return Number.isFinite(n) ? n : null
}


