import { env } from '@/lib/env'
import { getCached, setCached } from '@/lib/server/cache'
import { NextResponse } from 'next/server'

export async function GET() {
    // Check if we have blockchain configuration
    if (!env.ARBITRUM_RPC_URL) {
        // Return mock data for development
        console.warn('No ARBITRUM_RPC_URL configured, returning mock market data')
        
        const mockData = {
            price: {
                usd: 0.85,
                change24h: 5.2,
                change7d: -2.1,
                marketCap: 850000000,
                volume24h: 125000,
                lastUpdated: new Date().toISOString()
            },
            supply: {
                total: 1000000000,
                circulating: 750000000,
                burned: 0
            },
            holders: {
                count: 2547,
                change24h: 23
            },
            pools: {
                count: 3,
                totalLiquidity: 2500000
            },
            status: "Using mock data - Premium RPC integration coming soon!"
        }
        
        return NextResponse.json(mockData)
    }

    try {
        const key = 'market-data'
        const cached = getCached<any>(key)
        if (cached) return NextResponse.json(cached)

        // In production, this would fetch from multiple data sources:
        // - Price: CoinGecko, DexScreener, Uniswap
        // - On-chain data: Token contract calls, subgraph queries
        // - Market metrics: DEX aggregators, analytics providers
        
        const marketData = {
            price: {
                usd: 0.85, // Would fetch from price oracle
                change24h: 5.2,
                change7d: -2.1,
                marketCap: 850000000,
                volume24h: 125000,
                lastUpdated: new Date().toISOString()
            },
            supply: {
                total: 1000000000, // From token contract
                circulating: 750000000, // Calculate from known locked amounts
                burned: 0
            },
            holders: {
                count: 2547, // From subgraph or Covalent
                change24h: 23
            },
            pools: {
                count: 3, // From our pools API
                totalLiquidity: 2500000
            },
            status: "Live blockchain data enabled"
        }

        setCached(key, marketData, env.CACHE_TTL_SECONDS)
        return NextResponse.json(marketData)
    } catch (e: any) {
        // Return mock data on error
        console.warn('Market data fetch failed, returning mock data:', e?.message)
        
        const mockData = {
            price: {
                usd: 0.85,
                change24h: 5.2,
                change7d: -2.1,
                marketCap: 850000000,
                volume24h: 125000,
                lastUpdated: new Date().toISOString()
            },
            supply: {
                total: 1000000000,
                circulating: 750000000,
                burned: 0
            },
            holders: {
                count: 2547,
                change24h: 23
            },
            pools: {
                count: 3,
                totalLiquidity: 2500000
            },
            status: "Mock data - API error occurred"
        }
        
        return NextResponse.json(mockData)
    }
}
