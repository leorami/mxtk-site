"use client"
import WidgetFrame from '@/components/home/WidgetFrame'
import { apiGet } from '@/lib/api'
import type { PoolRow } from '@/lib/data/types'
import { useEffect, useState } from 'react'

export default function PoolsMini({ id }: { id: string }) {
  const [rows, setRows] = useState<PoolRow[]>([])
  useEffect(() => {
    apiGet<{ updatedAt: number; ttl: number; source?: string; data: PoolRow[] }>(`/data/pools`)
      .then((res) => setRows((res.data || []).slice(0, 3)))
      .catch(() => setRows([]))
  }, [])
  return (
    <div className="text-sm">
      <ol className="space-y-2">
        {rows.slice(0,3).map((r) => (
          <li key={r.address} className="flex items-center justify-between">
            <span className="truncate mr-2">{(r.token0?.symbol || '—')}/{(r.token1?.symbol || '—')}</span>
            <span className="tabular-nums opacity-80">{fmtUSD(r.tvlUSD)}</span>
          </li>
        ))}
        {rows.length === 0 && <li className="opacity-70">No pools yet.</li>}
      </ol>
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


