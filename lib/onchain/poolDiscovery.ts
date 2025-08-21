import { DEFAULT_FEE_TIERS, DEFAULT_STABLES } from '@/lib/config/tokens'
import { env } from '@/lib/env'
import { publicClient } from '@/lib/onchain/client'
import { UNISWAP_V3_FACTORY, uniswapV3FactoryAbi } from './abi/uniswapV3Factory'

// getPool returns address(0) when missing
async function getPool(tokenA: `0x${string}`, tokenB: `0x${string}`, fee: number) {
    try {
        const client = publicClient()
        const pool = await client.readContract({
            address: UNISWAP_V3_FACTORY,
            abi: uniswapV3FactoryAbi,
            functionName: 'getPool',
            args: [tokenA, tokenB, fee],
        }) as `0x${string}`
        return pool.toLowerCase() !== '0x0000000000000000000000000000000000000000' ? pool : null
    } catch (error) {
        console.error(`Error getting pool for ${tokenA} and ${tokenB} with fee ${fee}:`, error)
        return null
    }
}

/** Discover v3 pools for MXTK against a list of quote tokens and fee tiers. */
export async function discoverPoolsViaFactory(): Promise<Array<{ address: `0x${string}`, source: 'factory', fee: number, quote: `0x${string}` }>> {
    try {
        const mxtk = env.MXTK_TOKEN_ADDRESS as `0x${string}`
        const quotes = (env.DISCOVERY_QUOTES || '').split(',').map(s => s.trim()).filter(Boolean) as `0x${string}`[]
        const feeTiers = (env.DISCOVERY_FEES || '').split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))

        const Q = quotes.length ? quotes : (DEFAULT_STABLES as `0x${string}`[])
        const FEES = feeTiers.length ? feeTiers : DEFAULT_FEE_TIERS

        const work: Array<Promise<any>> = []
        for (const q of Q) {
            for (const f of FEES) {
                work.push(getPool(mxtk, q, f).then(p => p && { address: p, source: 'factory' as const, fee: f, quote: q }))
            }
        }
        const results = (await Promise.all(work)).filter(Boolean)
        // dedupe by address
        const seen = new Set<string>()
        return results.filter(r => {
            const k = r!.address.toLowerCase()
            if (seen.has(k)) return false
            seen.add(k); return true
        }) as any
    } catch (error) {
        console.error('Error in pool discovery:', error)
        return []
    }
}
