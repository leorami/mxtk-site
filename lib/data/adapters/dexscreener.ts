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
    const json = await fetchJsonWithGuards<DexRes>(url, { headers: { 'accept': 'application/json' } })
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

async function fetchJsonWithGuards<T>(url: string, init?: RequestInit, tries = 2): Promise<T> {
  const ctl = new AbortController()
  const timeout = setTimeout(() => ctl.abort(), 5000)
  try {
    const res = await fetch(url, { ...init, signal: ctl.signal })
    if (res.status === 429 || res.status === 503) {
      if (tries > 0) {
        const delay = 400 * Math.pow(2, 2 - tries)
        await new Promise(r => setTimeout(r, delay))
        return fetchJsonWithGuards<T>(url, init, tries - 1)
      }
      throw new Error(`backoff exhausted ${res.status}`)
    }
    if (!res.ok) throw new Error(`http ${res.status}`)
    const json = (await res.json().catch(() => null)) as T | null
    if (!json) throw new Error('invalid json')
    return json
  } finally {
    clearTimeout(timeout)
  }
}


