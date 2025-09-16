"use client"

import { apiGet } from '@/lib/api'
import { getApiPath } from '@/lib/basepath'
import type { PoolRow } from '@/lib/data/types'
import * as React from 'react'

type Props = { id: string; data?: { token?: string } }

function formatUSDCompact(v?: number | null): string {
  if (v == null || !isFinite(v)) return '—'
  const abs = Math.abs(v)
  if (abs >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(0)}`
}

function shortAddress(addr?: string): string {
  const a = (addr || '').trim()
  if (!/^0x[0-9a-fA-F]{40}$/.test(a)) return a || '—'
  return `${a.slice(0, 6)}\u2026${a.slice(-4)}`
}

export default function TopPoolsList({ data }: Props) {
  const token = (data?.token || '').trim()
  const [rows, setRows] = React.useState<PoolRow[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [openIdx, setOpenIdx] = React.useState<number | null>(null)

  const url = React.useMemo(() => {
    const qs = token ? `?token=${encodeURIComponent(token)}` : ''
    return getApiPath(`/api/data/pools${qs}`)
  }, [token])

  React.useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await apiGet<{ updatedAt: number; ttl: number; data: PoolRow[] }>(url)
        const list = Array.isArray(res.data) ? res.data : []
        if (mounted) setRows(list.slice(0, 6))
      } catch (e) {
        if (mounted) { setError('Failed to load'); setRows([]) }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    return () => { mounted = false }
  }, [url])

  return (
    <div>
      {rows.length > 0 && (
        <div className="grid grid-cols-[1fr_auto] items-center text-[11px] uppercase tracking-wide opacity-55 mb-1 select-none">
          <div>Pair</div>
          <div className="inline-flex items-center gap-3">
            <span>Vol 24h</span>
            <span>TVL</span>
          </div>
        </div>
      )}

      <ol className="divide-y divide-[color:var(--border-soft)]">
        {rows.map((r, i) => {
          const pair = `${r.token0?.symbol || '—'}/${r.token1?.symbol || '—'}`
          return (
            <li key={r.address} className="py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-medium leading-tight truncate">{pair}</div>
                <div className="text-xs opacity-70 leading-tight">{shortAddress(r.address)}</div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div className="min-w-[68px] text-xs tabular-nums">
                  <div className="sr-only">Vol 24h</div>
                  {formatUSDCompact(r.volume24hUSD ?? undefined)}
                </div>
                <div className="min-w-[68px] text-xs tabular-nums">
                  <div className="sr-only">TVL</div>
                  {formatUSDCompact(r.tvlUSD ?? undefined)}
                </div>
                <button
                  type="button"
                  aria-label="Open details"
                  aria-expanded={openIdx === i}
                  aria-controls={openIdx === i ? `pool-sheet-${i}` : undefined}
                  className="iconbtn min-w-[44px] min-h-[44px]"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                >
                  ▸
                </button>
              </div>

              {openIdx === i && (
                <div role="dialog" id={`pool-sheet-${i}`} aria-modal="true" className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-2">
                  <div className="absolute inset-0 bg-black/30" aria-hidden onClick={() => setOpenIdx(null)} />
                  <div className="relative z-10 w-full max-w-md glass glass--panel rounded-t-2xl sm:rounded-2xl border border-[color:var(--border-soft)] p-4">
                    <header className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold">{pair}</h3>
                      <button className="btn btn-ghost btn-sm" onClick={() => setOpenIdx(null)}>Close</button>
                    </header>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Address</span>
                        <span className="font-mono text-xs">{r.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Vol 24h</span>
                        <span className="tabular-nums">{formatUSDCompact(r.volume24hUSD ?? undefined)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">TVL</span>
                        <span className="tabular-nums">{formatUSDCompact(r.tvlUSD ?? undefined)}</span>
                      </div>
                      <div className="pt-2">
                        <a className="text-blue-600 dark:text-blue-400 hover:underline" href={`https://arbiscan.io/address/${r.address}`} target="_blank" rel="noopener noreferrer">View on explorer</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          )
        })}

        {rows.length === 0 && (
          <li className="py-3 text-sm opacity-70">{loading ? 'Loading…' : (error || 'No data') }</li>
        )}
      </ol>
    </div>
  )
}

export const meta = {
  id: 'top-pools',
  stages: ['training','preparing'],
  priority: 0.78,
  mobileFriendly: true,
  categories: ['Transparency','Markets'],
} as const


