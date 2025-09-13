"use client"
import Sparkline from '@/components/charts/Sparkline'
import { apiGet } from '@/lib/api'
import { getApiPath } from '@/lib/basepath'
import type { Series } from '@/lib/data/types'
import { useEffect, useMemo, useState } from 'react'

type PriceMiniProps = {
  id: string
  docId: string
  data?: { symbol?: string }
  refreshKey?: number
}

export default function PriceMini({ id, docId, data, refreshKey = 0 }: PriceMiniProps) {
  const symbol = (data?.symbol || 'MXTK').toString().trim()
  const [series, setSeries] = useState<Series>({ points: [] })
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const [deltaPct, setDeltaPct] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const url = useMemo(() => getApiPath(`/api/data/prices/${encodeURIComponent(symbol)}?days=7`), [symbol])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await apiGet<{ updatedAt: number; ttl: number; data: { symbol: string; days: number; series: Series; delta24hPct?: number } }>(url)
      setSeries(res.data?.series || { points: [] })
      setUpdatedAt(Number(res.updatedAt) || Date.now())
      setDeltaPct(typeof (res as any).data?.delta24hPct === 'number' ? (res as any).data.delta24hPct : null)
    } catch (e: any) {
      setError('Failed to load')
      setSeries({ points: [] })
      setUpdatedAt(Date.now())
      setDeltaPct(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [url, refreshKey])

  function freshness(): string | null {
    if (!updatedAt) return null
    const ageMs = Date.now() - updatedAt
    const mins = Math.floor(ageMs / 60000)
    if (mins < 1) return 'Updated just now'
    return `Updated ${mins}m ago`
  }

  async function promptEdit() {
    const next = window.prompt('Enter symbol (e.g., MXTK)', symbol)
    if (!next || next === symbol) return
    try {
      await fetch(getApiPath(`/api/ai/home/${encodeURIComponent(docId)}`), {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ widgets: [{ id, data: { symbol: next } }] }),
      })
      await load()
    } catch {}
  }

  const priceNow = useMemo(() => {
    const pts = series.points || []
    return pts.length ? pts[pts.length - 1].value : null
  }, [series])

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs opacity-70">{freshness()}</div>
        <div className="inline-flex gap-2 wframe-controls" data-nodrag>
          <button type="button" className="iconbtn" title="Refresh" onMouseDown={(e)=>e.stopPropagation()} onClick={(e)=>{ e.stopPropagation(); void load(); }}>↻</button>
          <button type="button" className="iconbtn" title="Edit" onMouseDown={(e)=>e.stopPropagation()} onClick={(e)=>{ e.stopPropagation(); promptEdit(); }}>✎</button>
        </div>
      </div>
      {symbol ? (
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <div className="text-lg font-semibold tabular-nums">
              {priceNow == null ? '—' : `$${priceNow.toFixed(4)}`}
            </div>
            <div className={`text-xs ${deltaPct == null ? 'opacity-60' : (deltaPct >= 0 ? 'text-green-600' : 'text-red-600')}`}>
              {deltaPct == null ? '—' : `${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(2)}% 24h`}
            </div>
            <div className="text-[11px] uppercase tracking-wide opacity-55 mt-1 select-none">Price</div>
          </div>
          <div className="flex-1 min-w-[8rem]">
            <Sparkline series={series} className="w-full h-8 opacity-90" />
            <div className="text-[11px] uppercase tracking-wide opacity-55 mt-1 text-right select-none">7d</div>
          </div>
        </div>
      ) : (
        <div className="opacity-70 text-sm">
          Set a symbol to view price.
          <span className="ml-2 [html.guide-open_&]:inline hidden">
            <button className="btn-link text-xs" onClick={promptEdit}>Edit</button>
          </span>
        </div>
      )}
    </div>
  )
}


