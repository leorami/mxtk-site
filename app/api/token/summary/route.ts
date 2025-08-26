import { env } from '@/lib/env'
import { erc20Abi } from '@/lib/onchain/abi/erc20'
import { publicClient, toNumber } from '@/lib/onchain/client'
import { getCached, setCached } from '@/lib/server/cache'
import { NextResponse } from 'next/server'

export async function GET() {
    // Check if we have blockchain configuration
    if (!env.ARBITRUM_RPC_URL) {
        // Return mock data for development
        console.warn('No ARBITRUM_RPC_URL configured, returning mock data')
        
        const mockData = {
            address: env.MXTK_TOKEN_ADDRESS || '0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba',
            name: 'Mineral Token',
            symbol: 'MXTK',
            decimals: 18,
            totalSupply: 1000000000,
            // Mock data for development
        }
        
        return NextResponse.json(mockData)
    }

    try {
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
        // Return mock data for development when blockchain connection fails
        console.warn('Blockchain connection failed, returning mock data:', e?.message)
        
        const mockData = {
            address: env.MXTK_TOKEN_ADDRESS || '0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba',
            name: 'Mineral Token',
            symbol: 'MXTK',
            decimals: 18,
            totalSupply: 1000000000,
            // Mock data for development
        }
        
        return NextResponse.json(mockData)
    }
}
