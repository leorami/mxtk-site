'use client'

import Card from '@/components/ui/Card'
import { formatUSD } from '@/lib/onchain/math'
import { useApi } from './useApi'

type PoolsResp = {
    pools: Array<{
        address: string
        source?: 'factory' | 'dexscreener' | 'manual'
        fee?: number
        token0?: { address: string; symbol: string; decimals: number }
        token1?: { address: string; symbol: string; decimals: number }
        approxMxtkUSD?: number | null
        volume24hUSD?: number | null
        fees24hUSD?: number | null
        tvlUSD?: number | null
        error?: string
    }>
}

export default function PoolTable() {
    const { data, loading, error } = useApi<PoolsResp>('/api/pools?auto=1', { refreshMs: 30000 })

    return (
        <Card tint="navy" embedded>
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">Uniswap v3 Pools</div>
                {loading && <div className="text-xs text-muted">Refreshing…</div>}
            </div>
            {error && <div className="text-sm text-red-600">Error: {error}</div>}
            <div className="overflow-x-auto">
                <table className="table text-sm">
                    <thead>
                        <tr>
                            <th>Pool</th>
                            <th>Source</th>
                            <th>Pair</th>
                            <th>Fee</th>
                            <th>Price (approx)</th>
                            <th>24h Volume</th>
                            <th>TVL</th>
                            <th>24h Fees</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.pools?.length
                            ? data.pools.map(p => (
                                <tr key={p.address}>
                                    <td><a className="table-link" target="_blank" href={`https://arbiscan.io/address/${p.address}`}>{p.address.slice(0, 6)}…{p.address.slice(-4)}</a></td>
                                    <td>
                                        <span className="rounded-xl border px-2 py-0.5 text-xs">
                                            {p.source ?? 'n/a'}
                                        </span>
                                    </td>
                                    <td>{p.token0?.symbol}/{p.token1?.symbol}</td>
                                    <td>{p.fee ? `${p.fee / 10000}%` : '—'}</td>
                                    <td>{p.approxMxtkUSD ? `${formatUSD(p.approxMxtkUSD)} / MXTK` : '—'}</td>
                                    <td>{formatUSD(p.volume24hUSD ?? undefined)}</td>
                                    <td>{formatUSD(p.tvlUSD ?? undefined)}</td>
                                    <td>{formatUSD(p.fees24hUSD ?? undefined)}</td>
                                </tr>
                            ))
                            : <tr><td colSpan={8} className="text-center text-muted py-6">{loading ? 'Loading…' : 'No pools discovered yet'}</td></tr>}
                    </tbody>
                </table>
            </div>
            <div className="mt-2 text-xs text-muted">
                <strong>Source</strong> explains how we found the pool: <em>factory</em> (on-chain), <em>dexscreener</em> (indexer), or <em>manual</em> (env). TVL/24h metrics need the Uniswap v3 subgraph; otherwise they show "—".
            </div>
        </Card>
    )
}
