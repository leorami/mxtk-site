"use client"

import DataTableGlass from '@/components/ui/DataTableGlass'
import { apiGet } from '@/lib/api'
import { getApiPath } from '@/lib/basepath'
import { env } from '@/lib/env'
import React from 'react'

type Props = { id: string; data?: { token?: string; limit?: number } }

function getHomeIdFallback(): string {
  try {
    const m = document.cookie.match(/(?:^|; )mxtk_home_id=([^;]+)/)
    return m ? decodeURIComponent(m[1]) : 'default'
  } catch { return 'default' }
}

export default function PoolsTable({ id, data }: Props) {
  const token = (data?.token || env.MXTK_TOKEN_ADDRESS).trim()
  const [limit, setLimit] = React.useState<number>(() => Math.max(1, Math.min(50, Number(data?.limit || 5))))
  const [rows, setRows] = React.useState<any[]>([])
  const [updatedAt, setUpdatedAt] = React.useState<number | undefined>(undefined)
  const [ttl, setTtl] = React.useState<number | undefined>(undefined)
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const url = React.useMemo(() => getApiPath(`/api/data/pools?token=${encodeURIComponent(token)}`), [token])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiGet<{ updatedAt: number; ttl: number; data: any[] }>(url)
      const list = Array.isArray(resp.data) ? resp.data : []
      setRows(list.slice(0, limit))
      setUpdatedAt(Number(resp.updatedAt) || Date.now())
      setTtl(Number(resp.ttl) || 0)
    } catch (e) {
      setError('Failed to load')
      setRows(prev => prev.length ? prev.slice(0, limit) : [])
      setUpdatedAt(prev => prev || Date.now())
      setTtl(0)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { void load() }, [url, limit])

  async function persistLimit(next: number) {
    const homeId = getHomeIdFallback()
    try {
      await fetch(getApiPath(`/api/ai/home/${encodeURIComponent(homeId)}`), {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ widgets: [{ id, data: { limit: next } }] })
      })
    } catch {}
  }

  return (
    <div className="relative">
      <DataTableGlass rows={rows} updatedAt={updatedAt} ttl={ttl} stackedMobile />
      {/* Guide-only settings */}
      <div className="absolute right-2 top-2 opacity-0 pointer-events-none [html.guide-open_&]:opacity-100 [html.guide-open_&]:pointer-events-auto transition-opacity" data-nodrag onMouseDown={(e)=>e.stopPropagation()}>
        <button className="iconbtn" title="Settings" onClick={() => setOpen(o => !o)}>⚙︎</button>
        {open && (
          <div className="absolute right-0 mt-2 z-10 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card-emb)] shadow p-3 min-w-[180px]">
            <div className="text-sm font-medium mb-2">Rows</div>
            <div className="inline-flex gap-2 text-sm">
              {[3,5,10].map(n => (
                <button key={n} className={["px-2 py-0.5 rounded border", n===limit? 'bg-[color:var(--glass-70)] border-[color:var(--border-soft)]' : 'border-transparent bg-transparent'].join(' ')} onClick={() => setLimit(n)}>{n}</button>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => { void persistLimit(limit); setOpen(false); }}>Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


