import { Series } from '@/lib/data/types';

export default function Sparkline({ series, className }: { series: Series; className?: string }) {
  const points = series.points || []
  const vbW = 100
  const vbH = 32
  const min = series.min ?? Math.min(...points.map(p => p.value))
  const max = series.max ?? Math.max(...points.map(p => p.value))
  const span = Math.max(1e-9, max - min)
  const n = Math.max(1, points.length)
  const d = points.map((p, i) => {
    const x = (i / (n - 1 || 1)) * vbW
    const y = vbH - ((p.value - min) / span) * vbH
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')

  return (
    <svg className={className} viewBox={`0 0 ${vbW} ${vbH}`} role="img" aria-label="sparkline">
      <path d={d} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}


