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
                <div className="text-sm font-semibold">Uniswap v4 Pools</div>
                {loading && <div className="text-xs text-muted">Refreshing…</div>}
            </div>
            {error && <div className="text-sm text-red-600">Error: {error}</div>}

            {/* Mobile card layout */}
            <div className='mt-2 space-y-3 md:hidden'>
                {data?.pools?.length
                    ? data.pools.map(p => (
                        <div key={p.address} className="rounded-lg border border-[var(--border-soft)] p-3 bg-[var(--surface-card-emb)]">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="font-medium text-[var(--ink-strong)] mb-1">
                                        <a className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" href={`https://arbiscan.io/address/${p.address}`}>
                                            {p.address.slice(0, 6)}…{p.address.slice(-4)}
                                        </a>
                                    </div>
                                    <div className="text-sm text-[var(--ink-strong)]">{p.token0?.symbol}/{p.token1?.symbol}</div>
                                </div>
                                <span className="rounded-xl border px-2 py-0.5 text-xs ml-2">
                                    {p.source ?? 'n/a'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">Fee</div>
                                    <div className="text-[var(--ink-strong)]">{p.fee ? `${p.fee / 10000}%` : '—'}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">Price</div>
                                    <div className="text-[var(--ink-strong)]">{p.approxMxtkUSD ? `${formatUSD(p.approxMxtkUSD)} / MXTK` : '—'}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">24h Volume</div>
                                    <div className="text-[var(--ink-strong)]">{formatUSD(p.volume24hUSD ?? undefined)}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">TVL</div>
                                    <div className="text-[var(--ink-strong)]">{formatUSD(p.tvlUSD ?? undefined)}</div>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-[var(--border-soft)]">
                                <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">24h Fees</div>
                                <div className="text-[var(--ink-strong)]">{formatUSD(p.fees24hUSD ?? undefined)}</div>
                            </div>
                        </div>
                    ))
                    : <div className="text-center text-muted py-6">{loading ? 'Loading…' : 'No pools discovered yet'}</div>}
            </div>

            {/* Desktop table layout */}
            <div className="overflow-x-auto hidden md:block">
                <table className="table text-sm md:table-fixed">
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
                                <tr key={p.address} className="align-top">
                                    <td>
                                        <a className="table-link" target="_blank" href={`https://arbiscan.io/address/${p.address}`}>{p.address.slice(0, 6)}…{p.address.slice(-4)}</a>
                                    </td>
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
                <strong>Source</strong> explains how we found the pool: <em>factory</em> (on-chain), <em>dexscreener</em> (indexer), or <em>manual</em> (env). TVL/24h metrics need the Uniswap v4 subgraph; otherwise they show "—".
            </div>
        </Card>
    )
}
