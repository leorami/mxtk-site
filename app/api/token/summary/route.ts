import { assertEnv, env } from '@/lib/env'
import { erc20Abi } from '@/lib/onchain/abi/erc20'
import { publicClient, toNumber } from '@/lib/onchain/client'
import { getCached, setCached } from '@/lib/server/cache'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        assertEnv()
        const key = 'token-summary'
        const cached = getCached<any>(key)
        if (cached) return NextResponse.json(cached)

        const client = publicClient()
        const [name, symbol, decimals, totalSupply] = await Promise.all([
            client.readContract({ address: env.MXTK_TOKEN_ADDRESS as `0x${string}`, abi: erc20Abi, functionName: 'name' }),
            client.readContract({ address: env.MXTK_TOKEN_ADDRESS as `0x${string}`, abi: erc20Abi, functionName: 'symbol' }),
            client.readContract({ address: env.MXTK_TOKEN_ADDRESS as `0x${string}`, abi: erc20Abi, functionName: 'decimals' }) as Promise<number>,
            client.readContract({ address: env.MXTK_TOKEN_ADDRESS as `0x${string}`, abi: erc20Abi, functionName: 'totalSupply' }) as Promise<bigint>,
        ])

        const body = {
            address: env.MXTK_TOKEN_ADDRESS,
            name, symbol,
            decimals,
            totalSupply: toNumber(totalSupply, decimals),
            // holders: (subgraph/covalent could be added later)
        }

        setCached(key, body, env.CACHE_TTL_SECONDS)
        return NextResponse.json(body)
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'token error' }, { status: 500 })
    }
}
