import React from 'react'
import cn from 'classnames'
import { PoolRow } from '@/lib/data/types'

export default function DataTableGlass({ rows, className }: { rows: PoolRow[]; className?: string }) {
  return (
    <div className={cn('glass glass--panel rounded-[var(--radius-lg)] overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-white/70 dark:bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <tr className="text-left text-ink-subtle">
              <th className="px-4 py-3">Pool</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Price (MXTK/USD)</th>
              <th className="px-4 py-3">24h Volume</th>
              <th className="px-4 py-3">24h Fees</th>
              <th className="px-4 py-3">TVL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.address} className={cn(i % 2 === 0 ? 'bg-white/20 dark:bg-white/5' : 'bg-transparent')}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium">{symbolPair(r)}</div>
                  <div className="text-ink-subtle text-xs">{short(r.address)}</div>
                </td>
                <td className="px-4 py-3">{r.fee ? `${(r.fee / 100).toFixed(2)}%` : '—'}</td>
                <td className="px-4 py-3">{fmtUSD(r.approxMxtkUSD)}</td>
                <td className="px-4 py-3">{fmtUSD(r.volume24hUSD)}</td>
                <td className="px-4 py-3">{fmtUSD(r.fees24hUSD)}</td>
                <td className="px-4 py-3">{fmtUSD(r.tvlUSD)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked view */}
      <div className="sm:hidden divide-y divide-white/10">
        {rows.map((r) => (
          <dl key={r.address} className="p-4 grid grid-cols-3 gap-2">
            <div className="col-span-3">
              <div className="font-medium">{symbolPair(r)}</div>
              <div className="text-ink-subtle text-xs">{short(r.address)}</div>
            </div>
            <dt className="text-ink-subtle">Fee</dt><dd className="col-span-2">{r.fee ? `${(r.fee / 100).toFixed(2)}%` : '—'}</dd>
            <dt className="text-ink-subtle">Price</dt><dd className="col-span-2">{fmtUSD(r.approxMxtkUSD)}</dd>
            <dt className="text-ink-subtle">Vol 24h</dt><dd className="col-span-2">{fmtUSD(r.volume24hUSD)}</dd>
            <dt className="text-ink-subtle">Fees 24h</dt><dd className="col-span-2">{fmtUSD(r.fees24hUSD)}</dd>
            <dt className="text-ink-subtle">TVL</dt><dd className="col-span-2">{fmtUSD(r.tvlUSD)}</dd>
          </dl>
        ))}
      </div>
    </div>
  )
}

function fmtUSD(v?: number | null): string {
  if (v === null || v === undefined || !isFinite(v)) return '—'
  const abs = Math.abs(v)
  if (abs >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}m`
  if (abs >= 1_000) return `$${(v / 1_000).toFixed(1)}k`
  return `$${v.toFixed(2)}`
}

function short(addr: string) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : ''
}

function symbolPair(r: PoolRow) {
  const s0 = r.token0?.symbol?.toUpperCase() || '—'
  const s1 = r.token1?.symbol?.toUpperCase() || '—'
  return `${s0}/${s1}`
}


