"use client"
import { apiGet } from '@/lib/api'
import type { Series } from '@/lib/data/types'
import { useEffect, useMemo, useState } from 'react'

export default function PriceMini({ symbol = 'MXTK' }: { symbol?: string }) {
  const [series, setSeries] = useState<Series>({ points: [] })
  useEffect(() => {
    apiGet<{ updatedAt: number; ttl: number; data: { symbol: string; days: number; series: Series } }>(`/data/prices/${encodeURIComponent(symbol)}?days=7`)
      .then((res) => setSeries(res.data?.series || { points: [] }))
      .catch(() => setSeries({ points: [] }))
  }, [symbol])
  const pathD = useMemo(() => buildSpark(series), [series])
  return (
    <div className="h-full">
      <svg viewBox="0 0 200 48" width="100%" height="48" aria-label="price sparkline">
        <path d={pathD} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </div>
  )
}

function buildSpark(series: Series): string {
  const pts = series.points || []
  if (!pts.length) return ''
  const min = series.min ?? Math.min(...pts.map(p => p.value))
  const max = series.max ?? Math.max(...pts.map(p => p.value))
  const start = series.start ?? pts[0].time
  const end = series.end ?? pts[pts.length - 1].time
  const span = Math.max(1e-9, max - min)
  const timeSpan = Math.max(1, end - start)
  const w = 200, h = 48, pad = { l: 0, r: 0, t: 2, b: 6 }
  const x = (t: number) => pad.l + ((t - start) / timeSpan) * (w - pad.l - pad.r)
  const y = (v: number) => h - pad.b - ((v - min) / span) * (h - pad.t - pad.b)
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.time).toFixed(2)},${y(p.value).toFixed(2)}`).join(' ')
}


