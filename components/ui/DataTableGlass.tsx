"use client"
import { PoolRow } from '@/lib/data/types';
import cn from 'classnames';
import { useMemo, useState } from 'react';

type SortKey = 'pool' | 'price' | 'vol24' | 'tvl' | 'fees24'

export default function DataTableGlass({ rows, className, updatedAt, ttl }: { rows: PoolRow[]; className?: string; updatedAt?: number; ttl?: number }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'tvl', dir: 'desc' })
  const sorted = useMemo(() => sortRows(rows, sort.key, sort.dir), [rows, sort])

  if (!rows || rows.length === 0) {
    return (
      <div className={cn('glass glass--panel rounded-[var(--radius-lg)] p-6 text-center text-ink-subtle', className)}>
        <div className="text-sm">No pools available at the moment.</div>
        <div className="text-xs opacity-80 mt-1">Data will appear once a supported source is live.</div>
      </div>
    )
  }

  const badge = useMemo(() => makeBadge(updatedAt, ttl), [updatedAt, ttl])

  return (
    <div className={cn('glass glass--panel rounded-[var(--radius-lg)] overflow-hidden relative', className)}>
      {badge && (
        <div className="absolute right-3 top-3 pointer-events-none select-none">
          <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] leading-tight', badge.kind==='live'? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300':'bg-amber-500/20 text-amber-700 dark:text-amber-300')}>
            {badge.label}
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table data-testid="pools-table" className="min-w-full text-sm">
          <thead className="sticky top-0 bg-white/70 dark:bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-white/60" style={{ position: 'sticky', top: 0 }}>
            <tr className="text-left text-ink-subtle select-none">
              <SortableTh label="Pool" active={sort.key==='pool'} dir={sort.dir} onClick={() => toggle(setSort, 'pool')} />
              <th className="px-4 py-3">Fee</th>
              <SortableTh label="Price (MXTK/USD)" active={sort.key==='price'} dir={sort.dir} onClick={() => toggle(setSort, 'price')} />
              <SortableTh label="24h Volume" active={sort.key==='vol24'} dir={sort.dir} onClick={() => toggle(setSort, 'vol24')} />
              <SortableTh label="24h Fees" active={sort.key==='fees24'} dir={sort.dir} onClick={() => toggle(setSort, 'fees24')} />
              <SortableTh label="TVL" active={sort.key==='tvl'} dir={sort.dir} onClick={() => toggle(setSort, 'tvl')} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
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
        {sorted.map((r) => (
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

function SortableTh({ label, active, dir, onClick }: { label: string; active: boolean; dir: 'asc'|'desc'; onClick: () => void }) {
  return (
    <th
      className={cn('px-4 py-3 cursor-pointer sticky top-0 bg-white/70 dark:bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-white/60', active && 'text-ink font-semibold')}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      tabIndex={0}
      role="columnheader"
      aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span aria-hidden className="opacity-60 text-xs">{active ? (dir === 'asc' ? '▲' : '▼') : ''}</span>
      </span>
    </th>
  )
}

function toggle(set: (u: any) => void, key: SortKey) {
  set((prev: { key: SortKey; dir: 'asc'|'desc' }) => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'tvl' ? 'desc' : 'asc' })
}

function sortRows(rows: PoolRow[], key: SortKey, dir: 'asc'|'desc'): PoolRow[] {
  const copy = [...(rows || [])]
  const val = (r: PoolRow): number | string => {
    switch (key) {
      case 'pool': return `${r.token0?.symbol || ''}/${r.token1?.symbol || ''}`.toUpperCase()
      case 'price': return n(r.approxMxtkUSD)
      case 'vol24': return n(r.volume24hUSD)
      case 'fees24': return n(r.fees24hUSD)
      case 'tvl': return n(r.tvlUSD)
    }
  }
  copy.sort((a, b) => {
    const av = val(a) as any
    const bv = val(b) as any
    if (typeof av === 'string' || typeof bv === 'string') {
      const cmp = String(av).localeCompare(String(bv))
      return dir === 'asc' ? cmp : -cmp
    }
    const cmp = (av - bv)
    return dir === 'asc' ? cmp : -cmp
  })
  return copy
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

function n(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value as any)
  return Number.isFinite(num) ? num : Number.NEGATIVE_INFINITY
}

function makeBadge(updatedAt?: number, ttl?: number): { kind: 'live'|'stale'; label: string } | null {
  if (!updatedAt) return null
  const now = Date.now()
  const nextExpiry = (updatedAt || now) + (ttl || 0)
  const ageMs = Math.max(0, now - (updatedAt || now))
  if (ageMs < 60_000 && nextExpiry > now) return { kind: 'live', label: 'Updated just now' }
  const minutes = Math.floor(ageMs / 60000)
  return { kind: 'stale', label: `Updated ${minutes}m ago` }
}


