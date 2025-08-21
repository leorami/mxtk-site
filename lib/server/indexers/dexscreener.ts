import { env } from '@/lib/env'

// Dexscreener is convenient for token->pairs lookup across many DEXs.
// We'll filter to Uniswap v3 on Arbitrum.
export async function fetchPoolsFromDexscreener(tokenAddress: string) {
    if (!env.DEXSCREENER_BASE) return []
    try {
        const url = `${env.DEXSCREENER_BASE}/tokens/${tokenAddress}`
        const res = await fetch(url, { next: { revalidate: 30 } })
        if (!res.ok) return []
        const json = await res.json()
        const pairs = json?.pairs || []
        return pairs
            .filter((p: any) =>
                (p?.chainId?.toLowerCase?.() === 'arbitrum' || p?.chainId === 'arbitrum-one') &&
                /uniswap-v3/i.test(p?.dexId || '') &&
                /^0x[a-fA-F0-9]{40}$/.test(p?.pairAddress || '')
            )
            .map((p: any) => ({ address: p.pairAddress as `0x${string}`, source: 'dexscreener' as const }))
    } catch { return [] }
}
