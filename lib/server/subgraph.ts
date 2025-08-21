import { env } from '@/lib/env'

export async function fetchPoolDailyData(poolAddress: string) {
    if (!env.UNISWAP_V3_SUBGRAPH_URL_ARBITRUM) return null

    const query = `
    query ($pool: ID!) {
      pool(id: $pool) {
        id
        totalValueLockedUSD
        volumeUSD
        feesUSD
        poolDayData(first: 2, orderBy: date, orderDirection: desc) {
          date
          volumeUSD
          feesUSD
          tvlUSD
        }
      }
    }`

    const res = await fetch(env.UNISWAP_V3_SUBGRAPH_URL_ARBITRUM, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query, variables: { pool: poolAddress.toLowerCase() } }),
        next: { revalidate: 30 }
    })
    if (!res.ok) return null
    const json = await res.json().catch(() => null)
    return json?.data?.pool || null
}
