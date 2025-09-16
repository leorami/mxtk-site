'use client'
import * as React from 'react'
import { getApiUrl } from '@/lib/api'
import type { HomeDoc, HomeSnapshotMeta } from '@/lib/home/types'

type Props = {
  open: boolean
  docId: string
  onClose: () => void
  onRestored?: (doc: HomeDoc) => void
}

export default function SnapshotManager({ open, docId, onClose, onRestored }: Props) {
  const [items, setItems] = React.useState<HomeSnapshotMeta[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const postSignal = React.useCallback((payload: any) => {
    try {
      fetch(getApiUrl(`/ai/signals`).replace(/\/api\//, '/api/'), {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: `sig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`, ts: Date.now(), ...payload }), cache: 'no-store'
      }).catch(() => {})
    } catch {}
  }, [])

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(getApiUrl(`/ai/home/${docId}/snapshots`), { cache: 'no-store' })
      if (res.ok) {
        const j = await res.json().catch(() => null)
        if (j && Array.isArray(j.items)) setItems(j.items)
      }
    } finally { setLoading(false) }
  }, [docId])

  React.useEffect(() => { if (open) { void load() } }, [open, load])

  async function onSave() {
    const note = window.prompt('Snapshot note (optional)') || undefined
    setSaving(true)
    try {
      const res = await fetch(getApiUrl(`/ai/home/${docId}/snapshots`), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ note }) })
      if (res.ok) {
        try { window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Snapshot saved' } })) } catch {}
        postSignal({ kind: 'snapshot.save', docId })
        await load()
      }
    } finally { setSaving(false) }
  }

  async function onRestore(id: string) {
    try {
      const res = await fetch(getApiUrl(`/ai/home/${docId}/snapshots/${id}`), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) })
      if (res.ok) {
        const j = await res.json().catch(() => null)
        if (j?.doc) {
          onRestored && onRestored(j.doc as HomeDoc)
          postSignal({ kind: 'snapshot.restore', docId })
          onClose()
        }
      }
    } catch {}
  }

  async function onDelete(id: string) {
    try {
      const res = await fetch(getApiUrl(`/ai/home/${docId}/snapshots/${id}`), { method: 'DELETE' })
      if (res.ok) {
        postSignal({ kind: 'snapshot.delete', docId })
        await load()
      }
    } catch {}
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center p-4" aria-modal="true" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="glass glass--panel rounded-xl border border-[color:var(--border-soft)] shadow-lg w-full max-w-2xl mt-16 p-4 md:p-5">
        <header className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Snapshots</h3>
          <div className="inline-flex gap-2">
            <button className="btn btn-sm" onClick={() => onSave()} disabled={saving}>Save</button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
          </div>
        </header>
        {loading && <div className="opacity-70 text-sm">Loading…</div>}
        {!loading && (!items || items.length === 0) && (
          <div className="opacity-70 text-sm">No snapshots yet</div>
        )}
        {!loading && items && items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left opacity-70">
                  <th className="py-2 pr-3">Note</th>
                  <th className="py-2 pr-3">Created</th>
                  <th className="py-2 pr-3">Widgets</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(s => (
                  <tr key={s.id} className="border-t border-[color:var(--border-soft)]/60">
                    <td className="py-2 pr-3">{s.note || <span className="opacity-60">—</span>}</td>
                    <td className="py-2 pr-3">{relativeTime(s.createdAt)}</td>
                    <td className="py-2 pr-3">{(s as any).widgetsCount ?? '—'}</td>
                    <td className="py-2">
                      <div className="inline-flex gap-2">
                        <button className="btn btn-sm" onClick={() => onRestore(s.id)}>Restore</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => onDelete(s.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function relativeTime(ts: number): string {
  try {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
    const diff = Date.now() - ts
    const mins = Math.round(diff / 60000)
    if (Math.abs(mins) < 60) return rtf.format(-mins, 'minute')
    const hours = Math.round(mins / 60)
    if (Math.abs(hours) < 24) return rtf.format(-hours, 'hour')
    const days = Math.round(hours / 24)
    return rtf.format(-days, 'day')
  } catch {
    return new Date(ts).toLocaleString()
  }
}


