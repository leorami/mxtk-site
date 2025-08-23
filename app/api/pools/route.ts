import { env } from '@/lib/env'
import { erc20Abi } from '@/lib/onchain/abi/erc20'
import { uniswapV4PoolAbi } from '@/lib/onchain/abi/uniswapV3Pool'
import { publicClient } from '@/lib/onchain/client'
import { priceFromSqrtPriceX96 } from '@/lib/onchain/math'
import { discoverPoolsViaFactory } from '@/lib/onchain/poolDiscovery'
import { getCached, setCached } from '@/lib/server/cache'
import { fetchPoolsFromDexscreener } from '@/lib/server/indexers/dexscreener'
import { fetchPoolDailyData } from '@/lib/server/subgraph'
import { NextResponse } from 'next/server'

function uniq<T extends { address: string }>(arr: T[]) {
    const seen = new Set<string>(); const out: T[] = []
    for (const x of arr) { const k = x.address.toLowerCase(); if (!seen.has(k)) { seen.add(k); out.push(x) } }
    return out
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const auto = url.searchParams.get('auto') === '1' || env.AUTO_DISCOVER_POOLS === '1'
        const key = `pools-v2:${auto}:${env.MXTK_POOLS}:${env.DISCOVERY_FEES}:${env.DISCOVERY_QUOTES}`
        const cached = getCached<any>(key); if (cached) return NextResponse.json(cached)

        // 1) Manual seeds from env
        const manual = (env.MXTK_POOLS ? env.MXTK_POOLS.split(',') : [])
            .map(s => s.trim()).filter(Boolean)
            .map(a => ({ address: a as `0x${string}`, source: 'manual' as const }))

        // 2) Factory discovery (MXTK vs stables/usdc/usdt/… across fee tiers)
        const fromFactory = auto ? await discoverPoolsViaFactory().catch(e => {
            console.error('Factory discovery error:', e)
            return []
        }) : []

        // 3) Dexscreener fallback (optional)
        const fromDex = auto ? await fetchPoolsFromDexscreener(env.MXTK_TOKEN_ADDRESS).catch(e => {
            console.error('Dexscreener error:', e)
            return []
        }) : []

        const discovered = uniq([...manual, ...fromFactory, ...fromDex])

        if (discovered.length === 0) {
            const body = { pools: [], discovered }
            setCached(key, body, env.CACHE_TTL_SECONDS)
            return NextResponse.json(body)
        }

        const client = publicClient()

        const results = await Promise.all(discovered.map(async (item) => {
            const poolAddr = item.address as `0x${string}`
            try {
                const [token0, token1, fee, liquidity, slot0] = await Promise.all([
                    client.readContract({ address: poolAddr, abi: uniswapV4PoolAbi, functionName: 'token0' }) as Promise<`0x${string}`>,
client.readContract({ address: poolAddr, abi: uniswapV4PoolAbi, functionName: 'token1' }) as Promise<`0x${string}`>,
client.readContract({ address: poolAddr, abi: uniswapV4PoolAbi, functionName: 'fee' }) as Promise<number>,
client.readContract({ address: poolAddr, abi: uniswapV4PoolAbi, functionName: 'liquidity' }) as Promise<bigint>,
client.readContract({ address: poolAddr, abi: uniswapV4PoolAbi, functionName: 'slot0' }) as any,
                ])

                const [sym0, dec0, sym1, dec1] = await Promise.all([
                    client.readContract({ address: token0, abi: erc20Abi, functionName: 'symbol' }) as Promise<string>,
                    client.readContract({ address: token0, abi: erc20Abi, functionName: 'decimals' }) as Promise<number>,
                    client.readContract({ address: token1, abi: erc20Abi, functionName: 'symbol' }) as Promise<string>,
                    client.readContract({ address: token1, abi: erc20Abi, functionName: 'decimals' }) as Promise<number>,
                ])

                const sqrt = slot0[0] as bigint
                const tick = Number(slot0[1])
                const p1per0 = isFinite(tick) ? priceFromSqrtPriceX96(sqrt, dec0, dec1) : null

                let approxMxtkUSD: number | null = null
                const s0 = sym0.toUpperCase(), s1 = sym1.toUpperCase()
                if (env.STABLE_SYMBOLS.includes(s0) && s1 === 'MXTK' && p1per0) approxMxtkUSD = 1 / p1per0
                if (env.STABLE_SYMBOLS.includes(s1) && s0 === 'MXTK' && p1per0) approxMxtkUSD = p1per0

                // Optional subgraph metrics
                const sg = await fetchPoolDailyData(poolAddr)
                const volume24h = sg?.poolDayData?.[0]?.volumeUSD ? Number(sg.poolDayData[0].volumeUSD) : null
                const fees24h = sg?.poolDayData?.[0]?.feesUSD ? Number(sg.poolDayData[0].feesUSD) : null
                const tvlUSD = sg?.totalValueLockedUSD ? Number(sg.totalValueLockedUSD) : null

                return {
                    address: poolAddr,
                    source: item.source,
                    fee,
                    token0: { address: token0, symbol: sym0, decimals: dec0 },
                    token1: { address: token1, symbol: sym1, decimals: dec1 },
                    tick, approxMxtkUSD, volume24hUSD: volume24h, fees24hUSD: fees24h, tvlUSD,
                }
            } catch (e: any) {
                return { address: poolAddr, source: item.source, error: e?.message || 'read error' }
            }
        }))

        const body = { pools: results, discovered }
        setCached(key, body, env.CACHE_TTL_SECONDS)
        return NextResponse.json(body)
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'pool error' }, { status: 500 })
    }
}
