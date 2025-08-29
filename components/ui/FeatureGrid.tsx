'use client'

import cn from 'classnames'
import MicroMark from './MicroMark'

type Item = { title: string; body?: string }

export default function FeatureGrid({
  items, cols = 3, className = ''
}:{ items: Item[]; cols?: 2|3; className?: string }) {
  const grid = cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
  return (
    <div className={cn('grid gap-8', grid, className)}>
      {items.map((it, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <MicroMark size={16} className="opacity-90" />
            <h3 className="text-base font-semibold tracking-tight">{it.title}</h3>
          </div>
          {it.body ? <p className="text-sm opacity-80">{it.body}</p> : null}
        </div>
      ))}
    </div>
  )
}


