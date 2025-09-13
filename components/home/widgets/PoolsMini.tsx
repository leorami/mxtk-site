"use client"
import { getApiPath } from '@/lib/basepath'
import { apiGet } from '@/lib/api'
import type { PoolRow } from '@/lib/data/types'
import { useEffect, useMemo, useState } from 'react'

type PoolsMiniProps = {
  id: string
  docId: string
  data?: { token?: string }
  refreshKey?: number
}

export default function PoolsMini({ id, docId, data, refreshKey = 0 }: PoolsMiniProps) {
  const token = (data?.token || '').trim()
  const [rows, setRows] = useState<PoolRow[]>([])
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const url = useMemo(() => {
    const qs = token ? `?token=${encodeURIComponent(token)}` : ''
    return getApiPath(`/api/data/pools${qs}`)
  }, [token])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await apiGet<{ updatedAt: number; ttl: number; data: PoolRow[] }>(url)
      setRows((res.data || []).slice(0, 5))
      setUpdatedAt(Number(res.updatedAt) || Date.now())
    } catch (e: any) {
      setError('Failed to load')
      setRows([])
      setUpdatedAt(Date.now())
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
    const next = window.prompt('Enter token address (0x...)', token)
    if (!next || next === token) return
    try {
      await fetch(getApiPath(`/api/ai/home/${encodeURIComponent(docId)}`), {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ widgets: [{ id, data: { token: next } }] }),
      })
      await load()
    } catch {}
  }

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs opacity-70">{freshness()}</div>
        <div className="inline-flex gap-2 wframe-controls" data-nodrag>
          <button type="button" className="iconbtn" title="Refresh" onMouseDown={(e)=>e.stopPropagation()} onClick={(e)=>{ e.stopPropagation(); void load(); }}>↻</button>
          <button type="button" className="iconbtn" title="Edit" onMouseDown={(e)=>e.stopPropagation()} onClick={(e)=>{ e.stopPropagation(); promptEdit(); }}>✎</button>
        </div>
      </div>
      {token ? (
        <ol className="space-y-2">
          {rows.slice(0,5).map((r) => (
            <li key={r.address} className="flex items-center justify-between">
              <span className="truncate mr-2">{(r.token0?.symbol || '—')}/{(r.token1?.symbol || '—')}</span>
              <span className="tabular-nums opacity-80">{fmtUSD(r.tvlUSD)}</span>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="opacity-70">{loading ? 'Loading...' : (error || 'No pools yet.')}</li>
          )}
        </ol>
      ) : (
        <div className="opacity-70 text-sm">
          Set a token to view top pools.
          <span className="ml-2 [html.guide-open_&]:inline hidden">
            <button className="btn-link text-xs" onClick={promptEdit}>Edit</button>
          </span>
        </div>
      )}
    </div>
  )
}

function fmtUSD(v?: number | null): string {
  if (v === null || v === undefined || !isFinite(v)) return '—'
  const abs = Math.abs(v)
  if (abs >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}m`
  if (abs >= 1_000) return `$${(v / 1_000).toFixed(1)}k`
  return `$${Number(v).toFixed(2)}`
}

