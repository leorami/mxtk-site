"use client"
import { useMemo, useRef } from 'react';

export type MultiPoint = { t: number; v: number }

export default function TimeSeriesMulti({ data, range, onRangeChange, className }: { data: MultiPoint[]; range: '1D'|'1W'|'1M'|'1Y'; onRangeChange?: (r: '1D'|'1W'|'1M'|'1Y') => void; className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { path, min, max } = useMemo(() => buildPath(data), [data])
  const ariaLabel = `price series, min ${fmt(min)}, max ${fmt(max)}`

  return (
    <div ref={containerRef} className={className} tabIndex={0} aria-label={ariaLabel} role="img">
      <div className="flex gap-2 mb-2" role="group" aria-label="Select range">
        {(['1D','1W','1M','1Y'] as const).map(r => (
          <button key={r} type="button" onClick={() => onRangeChange?.(r)} className={`chip ${r===range?'chip--active':''}`} aria-pressed={r===range}>{r}</button>
        ))}
      </div>
      <svg viewBox="0 0 640 220" width="100%" height="220" aria-hidden={false}>
        <path d={path} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </div>
  )
}

function buildPath(points: MultiPoint[]): { path: string; min: number; max: number } {
  if (!points || points.length === 0) return { path: '', min: 0, max: 0 }
  const min = Math.min(...points.map(p => p.v))
  const max = Math.max(...points.map(p => p.v))
  const start = points[0].t
  const end = points[points.length - 1].t
  const span = Math.max(1e-9, max - min)
  const tspan = Math.max(1, end - start)
  const w = 640, h = 220, pad = { l: 40, r: 12, t: 8, b: 22 }
  const x = (t: number) => pad.l + ((t - start) / tspan) * (w - pad.l - pad.r)
  const y = (v: number) => h - pad.b - ((v - min) / span) * (h - pad.t - pad.b)
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.t).toFixed(2)},${y(p.v).toFixed(2)}`).join(' ')
  return { path: d, min, max }
}

function fmt(v: number) { return Number.isFinite(v) ? `$${v.toFixed(2)}` : '$—' }


