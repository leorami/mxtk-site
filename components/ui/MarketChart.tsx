'use client'

import { useExperience } from '@/components/experience/ClientExperience'
import { apiGet } from '@/lib/api'
import { useEffect, useState } from 'react'

interface MarketData {
  price: {
    usd: number
    change24h: number
    change7d: number
    marketCap: number
    volume24h: number
  }
  supply: {
    total: number
    circulating: number
    burned: number
  }
  holders: {
    count: number
    change24h: number
  }
  pools: {
    count: number
    totalLiquidity: number
  }
  status: string
}

export default function MarketChart() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const { mode } = useExperience()
  const experienceLevel: 'beginner' | 'intermediate' | 'advanced' =
    mode === 'learn' ? 'beginner' : mode === 'build' ? 'intermediate' : 'advanced'

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await apiGet<MarketData>('/market')
        setMarketData(data)
      } catch (error) {
        console.error('Failed to fetch market data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
    // Refresh every minute
    const interval = setInterval(fetchMarketData, 60000)
    return () => clearInterval(interval)
  }, [])

  const getExplanation = (metric: string) => {
    const explanations = {
      beginner: {
        price: "The current price of one MXTK token in US dollars. This changes based on supply and demand.",
        volume: "How much MXTK was traded in the last 24 hours. Higher volume usually means more interest.",
        marketCap: "The total value of all MXTK tokens (price × total supply). Shows the overall size of the project.",
        holders: "The number of different wallets that own MXTK tokens. More holders can mean more adoption.",
      },
      intermediate: {
        price: "Real-time MXTK price from Uniswap liquidity pools, updated from on-chain data.",
        volume: "24h trading volume across all DEX pairs, indicating market activity and liquidity health.",
        marketCap: "Fully diluted market cap calculated from total token supply and current market price.",
        holders: "Unique wallet addresses holding MXTK, tracked via blockchain analytics and subgraph indexing.",
      },
      advanced: {
        price: "Price derived from Uniswap V3 pool tick spacing and liquidity concentration curves.",
        volume: "Aggregated volume from multiple DEX sources with time-weighted average price impact analysis.",
        marketCap: "FDV calculation accounting for locked tokens, vesting schedules, and treasury holdings.",
        holders: "Token holder distribution analysis including whale concentration and retail participation metrics.",
      }
    }
    return explanations[experienceLevel][metric as keyof typeof explanations.beginner] || ""
  }

  if (loading) {
    return (
      <div className="glass glass--panel p-6 rounded-xl animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!marketData) {
    return (
      <div className="glass glass--panel p-6 rounded-xl">
        <div className="text-center text-muted">
          <p>Unable to load market data</p>
          <p className="text-sm mt-2">Please check your connection and try again</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Data Source Notice */}
      <div className="glass p-4 rounded-xl border-l-4 border-orange-400">
        <p className="text-sm font-medium">Live Blockchain Data</p>
        <p className="text-xs text-muted mt-1">{marketData.status}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-muted">Price</div>
          <div className="text-2xl font-bold">${marketData.price.usd.toFixed(4)}</div>
          <div className={`text-sm ${marketData.price.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {marketData.price.change24h >= 0 ? '+' : ''}{marketData.price.change24h.toFixed(2)}% (24h)
          </div>
          <p className="text-xs text-muted mt-2">{getExplanation('price')}</p>
        </div>

        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-muted">Market Cap</div>
          <div className="text-2xl font-bold">${(marketData.price.marketCap / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-muted">Fully Diluted</div>
          <p className="text-xs text-muted mt-2">{getExplanation('marketCap')}</p>
        </div>

        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-muted">24h Volume</div>
          <div className="text-2xl font-bold">${(marketData.price.volume24h / 1000).toFixed(0)}K</div>
          <div className="text-sm text-muted">Across all pools</div>
          <p className="text-xs text-muted mt-2">{getExplanation('volume')}</p>
        </div>

        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-muted">Holders</div>
          <div className="text-2xl font-bold">{marketData.holders.count.toLocaleString()}</div>
          <div className="text-sm text-green-600">+{marketData.holders.change24h} (24h)</div>
          <p className="text-xs text-muted mt-2">{getExplanation('holders')}</p>
        </div>
      </div>

      {/* Educational Note */}
      {experienceLevel === 'beginner' && (
        <div className="glass p-4 rounded-xl bg-blue-50 border-l-4 border-blue-400">
          <h4 className="font-semibold text-blue-900 mb-2">💡 New to Token Trading?</h4>
          <p className="text-sm text-blue-800">
            These metrics show how MXTK performs in the market. 
            Higher volume usually means more people are interested in trading. 
            The price changes based on supply and demand, just like any other asset.
          </p>
        </div>
      )}

      {experienceLevel === 'advanced' && marketData.status.includes('Live') && (
        <div className="glass p-4 rounded-xl bg-green-50 border-l-4 border-green-400">
          <h4 className="font-semibold text-green-900 mb-2">🔗 Technical Details</h4>
          <div className="text-sm text-green-800 space-y-1">
            <p>• Price feeds from Uniswap V3 pools with {marketData.pools.count} active pairs</p>
            <p>• Data sourced from Arbitrum RPC with 30-second refresh intervals</p>
            <p>• Volume aggregated across DEX platforms via The Graph protocol</p>
            <p>• Holder counts derived from ERC-20 transfer event indexing</p>
          </div>
        </div>
      )}
    </div>
  )
}
