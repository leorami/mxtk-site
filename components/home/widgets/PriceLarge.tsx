"use client"

import TimeSeries from '@/components/charts/TimeSeries'
import { apiGet } from '@/lib/api'
import { getApiPath } from '@/lib/basepath'
import React from 'react'

type Interval = '24h' | '7d' | '30d'

type Props = {
  id: string
  data?: { symbol?: string; interval?: Interval }
  onPrefill?: (prompt: string) => void
  onRefresh?: () => void
}

function intervalToDays(iv: Interval): number {
  return iv === '24h' ? 1 : iv === '30d' ? 30 : 7
}

function getHomeIdFallback(): string {
  try {
    const m = document.cookie.match(/(?:^|; )mxtk_home_id=([^;]+)/)
    return m ? decodeURIComponent(m[1]) : 'default'
  } catch { return 'default' }
}

export default function PriceLarge({ id, data, onPrefill }: Props) {
  const symbol = (data?.symbol || 'MXTK').toString().trim() || 'MXTK'
  const [interval, setInterval] = React.useState<Interval>(() => (data?.interval as Interval) || '7d')
  const [updatedAt, setUpdatedAt] = React.useState<number | null>(null)
  const [ttl, setTtl] = React.useState<number>(0)
  const [loadingMeta, setLoadingMeta] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTick, setRefreshTick] = React.useState<number>(0)

  const days = React.useMemo(() => intervalToDays(interval), [interval])
  const metaUrl = React.useMemo(() => getApiPath(`/api/data/prices/${encodeURIComponent(symbol)}?days=${days}`), [symbol, days])

  // Listen for grid-level refresh events dispatched by Grid (local, not global)
  React.useEffect(() => {
    const ev = `widget:refresh:${id}`
    const handler = () => setRefreshTick(t => t + 1)
    window.addEventListener(ev, handler as EventListener)
    return () => window.removeEventListener(ev, handler as EventListener)
  }, [id])

  async function loadMeta() {
    setLoadingMeta(true)
    setError(null)
    try {
      const env = await apiGet<{ updatedAt: number; ttl: number; data: unknown }>(metaUrl)
      setUpdatedAt(Number(env.updatedAt) || Date.now())
      setTtl(Number(env.ttl) || 0)
    } catch (e) {
      setError('Failed to load')
      setUpdatedAt(prev => prev || Date.now())
      setTtl(0)
    } finally {
      setLoadingMeta(false)
    }
  }

  React.useEffect(() => { void loadMeta() }, [metaUrl, refreshTick])

  function badge(): { kind: 'live'|'stale'; label: string } | null {
    if (!updatedAt) return null
    const now = Date.now()
    const nextExpiry = (updatedAt || now) + (ttl || 0)
    const ageMs = Math.max(0, now - (updatedAt || now))
    if (ageMs < 60_000 && nextExpiry > now) return { kind: 'live', label: 'Updated just now' }
    const minutes = Math.floor(ageMs / 60000)
    return { kind: 'stale', label: `Updated ${minutes}m ago` }
  }

  async function persist(next: { symbol?: string; interval?: Interval }) {
    const homeId = getHomeIdFallback()
    try {
      await fetch(getApiPath(`/api/ai/home/${encodeURIComponent(homeId)}`), {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ widgets: [{ id, data: { symbol, interval, ...next } }] }),
      })
    } catch {}
  }

  function pickInterval(next: Interval) {
    if (next === interval) return
    setInterval(next)
    void persist({ interval: next })
  }

  function doRefresh(e?: React.MouseEvent) {
    e?.stopPropagation()
    setRefreshTick(t => t + 1)
  }

  return (
    <div className="space-y-3">
      {/* Compact header inside widget body */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <div className="text-sm font-medium">Price</div>
          {(() => {
            const b = badge()
            return b ? (
              <span className={[
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] leading-tight select-none',
                b.kind==='live' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
              ].join(' ')}>
                {b.label}
              </span>
            ) : null
          })()}
        </div>
        <div className="inline-flex items-center gap-2 opacity-0 pointer-events-none [html.guide-open_&]:opacity-100 [html.guide-open_&]:pointer-events-auto transition-opacity" data-nodrag onMouseDown={(e)=>e.stopPropagation()}>
          <div className="inline-flex rounded-full bg-[color:var(--glass-70)] border border-[color:var(--border-soft)] overflow-hidden text-[11px]">
            {(['24h','7d','30d'] as Interval[]).map((iv) => (
              <button key={iv} type="button" className={['px-2 py-0.5', iv===interval ? 'bg-[color:var(--surface-card-emb)] font-medium' : 'opacity-80'].join(' ')} onClick={() => pickInterval(iv)}>{iv}</button>
            ))}
          </div>
          <button type="button" className="iconbtn" title="Refresh" onClick={doRefresh}>↻</button>
        </div>
      </div>

      {/* Skeleton while first meta load */}
      {loadingMeta && (
        <div className="w-full h-[220px] rounded-md bg-[color:var(--glass-70)] animate-pulse" aria-hidden="true" />
      )}

      {/* Chart */}
      <TimeSeries key={`${symbol}:${days}:${refreshTick}`} symbol={symbol} days={days} />
      {error && <div className="text-xs text-ink-subtle">{error}</div>}
    </div>
  )
}


