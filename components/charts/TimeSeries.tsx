import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Series } from '@/lib/data/types'
import { apiGet } from '@/lib/api'

type Props = { symbol: string; days?: number; className?: string }

export default function TimeSeries({ symbol, days = 30, className }: Props) {
  const [series, setSeries] = useState<Series | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 640, h: 220 })

  // SSR-safe: path pre-renderable
  const pathD = useMemo(() => buildPath(series), [series])

  useEffect(() => {
    let mounted = true
    apiGet<{ series: Series }>(`/data/prices/${encodeURIComponent(symbol)}?days=${days}`)
      .then((res) => { if (mounted) setSeries(res.series) })
      .catch(() => { if (mounted) setSeries({ points: [] }) })
    return () => { mounted = false }
  }, [symbol, days])

  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === 'undefined') return
    const el = containerRef.current
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect
        setSize({ w: Math.max(200, cr.width), h: Math.max(160, cr.height) })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { ticksX, ticksY } = useMemo(() => computeAxes(series), [series])

  return (
    <div ref={containerRef} className={className}>
      <ChartSVG width={size.w} height={size.h} pathD={pathD} series={series} ticksX={ticksX} ticksY={ticksY} />
    </div>
  )
}

function ChartSVG({ width, height, pathD, series, ticksX, ticksY }: { width: number; height: number; pathD: string; series: Series | null; ticksX: number[]; ticksY: number[] }) {
  const pad = { l: 40, r: 12, t: 8, b: 22 }
  const w = Math.max(1, width)
  const h = Math.max(1, height)
  const vbW = w
  const vbH = h
  const path = pathD
  const min = series?.min ?? Math.min(...(series?.points || []).map(p => p.value), 0)
  const max = series?.max ?? Math.max(...(series?.points || []).map(p => p.value), 1)
  const span = Math.max(1e-9, max - min)
  const start = series?.start ?? series?.points?.[0]?.time
  const end = series?.end ?? series?.points?.[series.points.length - 1]?.time
  const timeSpan = Math.max(1, (end ?? 1) - (start ?? 0))

  const xScale = (t: number) => pad.l + ((t - (start ?? 0)) / timeSpan) * (vbW - pad.l - pad.r)
  const yScale = (v: number) => vbH - pad.b - ((v - min) / span) * (vbH - pad.t - pad.b)

  // Tooltip on client only
  const [hover, setHover] = useState<{ x: number; y: number; value: number } | null>(null)
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!series || !series.points?.length) return
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const rel = Math.min(1, Math.max(0, (x - pad.l) / (vbW - pad.l - pad.r)))
    const idx = Math.round(rel * (series.points.length - 1))
    const p = series.points[idx]
    setHover({ x: xScale(p.time), y: yScale(p.value), value: p.value })
  }

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} width={vbW} height={vbH} role="img" aria-label={`${series ? 'price series' : 'loading series'}`} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      {/* axes */}
      <g stroke="currentColor" strokeOpacity="0.25" strokeWidth={1}>
        <line x1={pad.l} y1={vbH - pad.b} x2={vbW - pad.r} y2={vbH - pad.b} />
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={vbH - pad.b} />
        {ticksY.map((t) => (
          <line key={`y-${t}`} x1={pad.l} y1={yScale(t)} x2={vbW - pad.r} y2={yScale(t)} />
        ))}
        {ticksX.map((t) => (
          <line key={`x-${t}`} x1={xScale(t)} y1={pad.t} x2={xScale(t)} y2={vbH - pad.b} />
        ))}
      </g>
      {/* path */}
      <path d={path} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {/* hover */}
      {hover && (
        <g>
          <circle cx={hover.x} cy={hover.y} r={3} fill="currentColor" />
          <rect x={hover.x + 8} y={hover.y - 14} width={64} height={18} rx={4} fill="currentColor" opacity={0.1} />
          <text x={hover.x + 12} y={hover.y} dominantBaseline="middle" fontSize={12} fill="currentColor">${hover.value.toFixed(2)}</text>
        </g>
      )}
    </svg>
  )
}

function buildPath(series: Series | null): string {
  const pts = series?.points || []
  if (!pts.length) return ''
  const min = series?.min ?? Math.min(...pts.map(p => p.value))
  const max = series?.max ?? Math.max(...pts.map(p => p.value))
  const start = series?.start ?? pts[0].time
  const end = series?.end ?? pts[pts.length - 1].time
  const span = Math.max(1e-9, max - min)
  const timeSpan = Math.max(1, end - start)
  const w = 640, h = 220, pad = { l: 40, r: 12, t: 8, b: 22 }
  const x = (t: number) => pad.l + ((t - start) / timeSpan) * (w - pad.l - pad.r)
  const y = (v: number) => h - pad.b - ((v - min) / span) * (h - pad.t - pad.b)
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.time).toFixed(2)},${y(p.value).toFixed(2)}`).join(' ')
}

function computeAxes(series: Series | null): { ticksX: number[]; ticksY: number[] } {
  const pts = series?.points || []
  if (!pts.length) return { ticksX: [], ticksY: [] }
  const min = series?.min ?? Math.min(...pts.map(p => p.value))
  const max = series?.max ?? Math.max(...pts.map(p => p.value))
  const start = series?.start ?? pts[0].time
  const end = series?.end ?? pts[pts.length - 1].time
  const ticksY = niceTicks(min, max, 4)
  const ticksX = timeTicks(start, end, 3)
  return { ticksX, ticksY }
}

function niceTicks(min: number, max: number, count: number): number[] {
  const span = Math.max(1e-9, max - min)
  const step = Math.pow(10, Math.floor(Math.log10(span / count)))
  const err = (span / count) / step
  const mult = err >= 7.5 ? 10 : err >= 3 ? 5 : err >= 1.5 ? 2 : 1
  const niceStep = step * mult
  const start = Math.ceil(min / niceStep) * niceStep
  const end = Math.floor(max / niceStep) * niceStep
  const ticks: number[] = []
  for (let v = start; v <= end + 1e-9; v += niceStep) ticks.push(Number(v.toFixed(6)))
  return ticks
}

function timeTicks(start: number, end: number, count: number): number[] {
  const span = Math.max(1, end - start)
  const step = span / count
  return [0, 1, 2, 3].slice(0, count + 1).map(i => Math.round(start + i * step))
}


