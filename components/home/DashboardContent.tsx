'use client'
import { useCopy } from '@/components/copy/Copy'
import { getApiUrl } from '@/lib/api'
import type { HomeDoc, SectionState } from '@/lib/home/types'
import * as React from 'react'
import Grid from './Grid'

type Props = { initialDocId?: string; initialDoc?: HomeDoc | null }

export default function DashboardContent({ initialDocId = 'default', initialDoc = null }: Props) {
  const { mode } = useCopy('dashboard')
  const [doc, setDoc] = React.useState<HomeDoc | null>(initialDoc)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [retryCount, setRetryCount] = React.useState(0)
  // Mirror widget controls behavior: only show move controls when Guide (Sherpa) is open
  const guideOpen = React.useSyncExternalStore(
    (onStoreChange) => {
      if (typeof document === 'undefined') return () => {}
      const root = document.documentElement
      const obs = new MutationObserver(() => onStoreChange())
      obs.observe(root, { attributes: true, attributeFilter: ['class'] })
      return () => obs.disconnect()
    },
    () => (typeof document !== 'undefined') ? document.documentElement.classList.contains('guide-open') : false,
    () => false
  )

  const sections: SectionState[] = React.useMemo(() => {
    if (!Array.isArray(doc?.sections)) return []
    const arr = [...(doc!.sections as SectionState[])]
    arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    return arr
  }, [doc])

  // --- Section reorder (drag handle + keyboard) -----------------------------
  const [dragSec, setDragSec] = React.useState<string | null>(null)
  const dragStartOrder = React.useRef<number | null>(null)
  const onSectionDragStart = React.useCallback((e: React.DragEvent, secId: string) => {
    if (!guideOpen) return
    setDragSec(secId)
    const o = sections.find(s => s.id === secId)?.order ?? null
    dragStartOrder.current = o
    e.dataTransfer.effectAllowed = 'move'
    try { e.dataTransfer.setData('text/plain', secId) } catch {}
  }, [sections, guideOpen])

  const onSectionDragOver = React.useCallback((e: React.DragEvent, overId: string) => {
    if (!guideOpen || !dragSec || dragSec === overId) return
    e.preventDefault()
  }, [dragSec, guideOpen])

  const persistSectionOrders = React.useCallback(async (ordered: SectionState[]) => {
    const payload = ordered.map(s => ({ id: s.id, order: s.order }))
    try {
      await fetch(getApiUrl(`/ai/home/${initialDocId}`), {
        method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sections: payload })
      })
    } catch {}
  }, [initialDocId])

  const onSectionDrop = React.useCallback(async (e: React.DragEvent, targetId: string) => {
    if (!guideOpen) return
    e.preventDefault()
    if (!dragSec || dragSec === targetId) { setDragSec(null); return }
    // compute new order indices
    setDoc(d => {
      if (!d) return d
      const cur = [...d.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      const movingIdx = cur.findIndex(s => s.id === dragSec)
      const targetIdx = cur.findIndex(s => s.id === targetId)
      if (movingIdx < 0 || targetIdx < 0) return d
      const before = cur.map((s, i) => ({ id: s.id, order: i }))
      const [moving] = cur.splice(movingIdx, 1)
      cur.splice(targetIdx, 0, moving)
      const reindexed = cur.map((s, i) => ({ ...s, order: i }))
      scheduleUndo({ kind: 'reorder', payload: before })
      persistSectionOrders(reindexed)
      return { ...d, sections: reindexed } as HomeDoc
    })
    setDragSec(null)
  }, [dragSec, persistSectionOrders, guideOpen])

  const toggleCollapse = React.useCallback(async (secId: string) => {
    let nextCollapsed = false;
    setDoc(d => {
      if (!d) return d;
      const current = d.sections.find(s => s.id === secId)?.collapsed;
      nextCollapsed = !current;
      const sections = d.sections.map(s => s.id === secId ? { ...s, collapsed: nextCollapsed } : s);
      return { ...d, sections } as HomeDoc;
    });
    try {
      await fetch(getApiUrl(`/ai/home/${initialDocId}`), {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sections: [{ id: secId, collapsed: nextCollapsed }] })
      })
    } catch {}
  }, [initialDocId])

  const loadData = React.useCallback(async (forceRetry = false): Promise<HomeDoc | null> => {
    if (forceRetry) {
      setRetryCount(count => count + 1)
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // 1) Try GET
      let res = await fetch(getApiUrl(`/ai/home/${initialDocId}`), { 
        cache: 'no-store',
        headers: { 'x-retry-count': retryCount.toString() }
      })
      
      if (res.status === 404) {
        // 2) Seed, then GET
        console.log('Dashboard: Home not found, seeding...')
        const seeded = await fetch(getApiUrl(`/ai/home/seed`), {
          method: 'POST',
          headers: { 
            'content-type': 'application/json',
            'x-retry-count': retryCount.toString()
          },
          body: JSON.stringify({ id: initialDocId, mode })
        })
        
        if (!seeded.ok) {
          const errorData = await seeded.json().catch(() => ({ error: 'Unknown error' }))
          console.error('Dashboard: Seed failed', errorData)
          setError(`Failed to seed dashboard: ${errorData.error || 'Unknown error'}`)
          setLoading(false)
          return
        }
        
        // Get the seeded data directly from the seed response
        const seedData = await seeded.json().catch(() => null)
        if (seedData && !seedData.error) {
          console.log('Dashboard: Seed successful')
          setDoc(seedData)
          setLoading(false)
          return
        }
        
        // If we couldn't get data from seed response, try GET again
        console.log('Dashboard: Trying GET after seed')
        res = await fetch(getApiUrl(`/ai/home/${initialDocId}`), { 
          cache: 'no-store',
          headers: { 'x-retry-count': retryCount.toString() }
        })
      }
      
      if (!res.ok) {
        console.error(`Dashboard: GET failed ${res.status}`)
        setError(`Failed to load dashboard: ${res.status} ${res.statusText}`)
        setLoading(false)
        return null
      }
      
      const j = await res.json().catch(() => null)
      if (j && !j.error) {
        console.log('Dashboard: GET successful')
        setDoc(j)
        return j
      } else {
        console.error('Dashboard: Invalid data', j)
        setError(`Invalid dashboard data: ${j?.error || 'Unknown format'}`)
      }
    } catch (err) {
      console.error('Dashboard: Error', err)
      setError(`Dashboard error: ${err instanceof Error ? err.message : String(err)}`)
      return null
    } finally {
      setLoading(false)
    }
    return null
  }, [initialDocId, mode, retryCount])

  // --- Undo (last op within 10s) -------------------------------------------
  type InverseOp = { kind: 'move' | 'resize' | 'reorder' | 'adapt-adds'; payload: any };
  const lastOp = React.useRef<{ op: InverseOp; timer: number | null } | null>(null)
  const [undoVisible, setUndoVisible] = React.useState(false)

  const scheduleUndo = React.useCallback((op: InverseOp) => {
    if (lastOp.current?.timer) window.clearTimeout(lastOp.current.timer)
    const timer = window.setTimeout(() => { lastOp.current = null; setUndoVisible(false) }, 10000)
    lastOp.current = { op, timer }
    setUndoVisible(true)
    try {
      const payload = { op, expiresAt: Date.now() + 10000, docId: initialDocId }
      sessionStorage.setItem('mxtk.home.undo', JSON.stringify(payload))
    } catch {}
  }, [])

  async function applyInverse(op: InverseOp) {
    try {
      if (op.kind === 'move') {
        await fetch(getApiUrl(`/ai/home/${initialDocId}`), { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widgets: op.payload }) })
      } else if (op.kind === 'resize') {
        await fetch(getApiUrl(`/ai/home/${initialDocId}`), { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widgets: op.payload }) })
      } else if (op.kind === 'reorder') {
        await fetch(getApiUrl(`/ai/home/${initialDocId}`), { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sections: op.payload }) })
      } else if (op.kind === 'adapt-adds') {
        await fetch(getApiUrl(`/ai/home/${initialDocId}`), { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widgets: op.payload }) })
      }
      setUndoVisible(false)
      lastOp.current && lastOp.current.timer && window.clearTimeout(lastOp.current.timer)
      lastOp.current = null
      try { sessionStorage.removeItem('mxtk.home.undo') } catch {}
      await loadData(true)
    } catch {}
  }

  // Restore pending undo across reloads within window
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem('mxtk.home.undo')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed?.docId !== initialDocId) { sessionStorage.removeItem('mxtk.home.undo'); return }
      if (typeof parsed.expiresAt === 'number' && parsed.expiresAt > Date.now()) {
        lastOp.current = { op: parsed.op, timer: null }
        setUndoVisible(true)
        const ms = parsed.expiresAt - Date.now()
        const t = window.setTimeout(() => { lastOp.current = null; setUndoVisible(false); try{sessionStorage.removeItem('mxtk.home.undo')}catch{} }, Math.max(0, ms))
        lastOp.current.timer = t as any
      } else {
        sessionStorage.removeItem('mxtk.home.undo')
      }
    } catch {}
  }, [initialDocId])

  React.useEffect(() => {
    let alive = true
    
    // Load data and set state only if component is still mounted
    loadData().then(() => {
      if (!alive) return
    })
    
    return () => { alive = false }
  }, [loadData])

  // listen for global refresh event dispatched by Adapt CTA
  React.useEffect(() => {
    async function onRefresh() {
      const before = doc?.widgets ? [...doc.widgets] : []
      const next = await loadData(true)
      if (next) {
        const beforeIds = new Set(before.map(w => w.id))
        const added = next.widgets.filter(w => !beforeIds.has(w.id))
        if (added.length) {
          const inverse = added.map(w => ({ id: w.id, remove: true }))
          scheduleUndo({ kind: 'adapt-adds', payload: inverse })
        }
      }
    }
    window.addEventListener('mxtk-dashboard-refresh', onRefresh as any)
    return () => window.removeEventListener('mxtk-dashboard-refresh', onRefresh as any)
  }, [doc, loadData, scheduleUndo])

  // Loading state
  if (loading) {
    return (
      <div className="section-rail">
        {['Overview','Learn','Build','Operate','Library'].map(t => (
          <section key={t} className="glass glass--panel p-4 md:p-6 mb-6 rounded-xl">
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold opacity-70">{t}</h2>
            </header>
            <div className="h-16 rounded-lg bg-slate-200 dark:bg-slate-700/30 animate-pulse" />
          </section>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="section-rail">
        <section className="glass glass--panel p-4 md:p-6 mb-6 rounded-xl border border-red-300 dark:border-red-800">
          <header className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Dashboard Error</h2>
          </header>
          <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
          <button 
            onClick={() => loadData(true)}
            className="btn btn--pill px-4 py-2 rounded-xl shadow-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
          >
            Reload Dashboard
          </button>
        </section>
      </div>
    )
  }

  // No document state
  if (!doc) {
    return (
      <div className="section-rail">
        {['Overview','Learn','Build','Operate','Library'].map(t => (
          <section key={t} className="glass glass--panel p-4 md:p-6 mb-6 rounded-xl">
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold opacity-70">{t}</h2>
            </header>
            <div className="h-16 rounded-lg opacity-40" />
          </section>
        ))}
      </div>
    )
  }

  // Render the dashboard
  return (
    <div className="section-rail">
      {undoVisible && (
        <div className="mb-3 text-sm opacity-80">
          <button className="btn btn-ghost px-2 py-1" onClick={() => { if (lastOp.current) applyInverse(lastOp.current.op) }}>Undo</button>
        </div>
      )}
      {sections.map((sec) => {
        const widgets = doc.widgets.filter(w => w.sectionId === sec.id)
        return (
          <section id={sec.id} key={sec.id} className="glass glass--panel p-4 md:p-6 mb-6 rounded-xl">
            <header
              className="wf-head flex items-center justify-between mb-3"
              onDragOver={(e) => onSectionDragOver(e, sec.id)}
              onDrop={(e) => onSectionDrop(e, sec.id)}
            >
              <h2 className="wf-title text-lg font-semibold">
                {/* drag handle: only visible when Guide (Sherpa) is open */}
                {guideOpen && (
                <button
                  className="iconbtn mr-2"
                  title="Reorder section"
                  aria-label={`Reorder ${sec.title}`}
                  draggable
                  onDragStart={(e) => onSectionDragStart(e, sec.id)}
                  onClick={(e) => {
                    // Click = move down; Shift+Click = move up (accessible fallback)
                    if (!guideOpen) return
                    const dir = e.shiftKey ? -1 : 1
                    setDoc(d => {
                      if (!d) return d
                      const cur = [...d.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      const idx = cur.findIndex(s => s.id === sec.id)
                      if (idx < 0) return d
                      const ni = Math.max(0, Math.min(cur.length - 1, idx + dir))
                      if (ni === idx) return d
                      const before = cur.map((s, i) => ({ id: s.id, order: i }))
                      const [mv] = cur.splice(idx, 1)
                      cur.splice(ni, 0, mv)
                      const re = cur.map((s, i) => ({ ...s, order: i }))
                      scheduleUndo({ kind: 'reorder', payload: before })
                      persistSectionOrders(re)
                      return { ...d, sections: re } as HomeDoc
                    })
                  }}
                  onKeyDown={(e) => {
                    if (!guideOpen) return
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault()
                      setDoc(d => {
                        if (!d) return d
                        const cur = [...d.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        const idx = cur.findIndex(s => s.id === sec.id)
                        if (idx < 0) return d
                        const dir = e.key === 'ArrowUp' ? -1 : 1
                        const ni = Math.max(0, Math.min(cur.length - 1, idx + dir))
                        const [mv] = cur.splice(idx, 1)
                        cur.splice(ni, 0, mv)
                        const re = cur.map((s, i) => ({ ...s, order: i }))
                        persistSectionOrders(re)
                        return { ...d, sections: re } as HomeDoc
                      })
                    }
                  }}
                  data-nodrag
                >≡</button>
                )}
                {sec.title}
              </h2>
              <div className="wf-actions flex items-center gap-2" data-nodrag>
                <button
                  className="text-sm opacity-80 hover:opacity-100"
                  aria-expanded={!sec.collapsed}
                  onClick={(e) => { e.preventDefault(); toggleCollapse(sec.id); }}
                >{sec.collapsed ? 'Expand' : 'Collapse'}</button>
              </div>
            </header>
            {/* drop also works on header; no extra target needed */}
            {!sec.collapsed && (
              <div className="section-body">
                <Grid doc={{ ...doc, widgets }} onPatch={async (_id, updates) => {
                  try {
                    // compute inverse before send
                    const inv = updates.map(u => {
                      const cur = doc.widgets.find(w => w.id === u.id)
                      return cur ? { id: cur.id, pos: u.pos ? { ...cur.pos } : undefined, size: u.size ? { ...cur.size } : undefined } : u
                    })
                    const kind = updates.some(u => u.size) ? 'resize' : 'move' as const
                    scheduleUndo({ kind, payload: inv })
                  } catch {}
                  await fetch(getApiUrl(`/ai/home/${initialDocId}`), {
                    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widgets: updates })
                  })
                }} />
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}