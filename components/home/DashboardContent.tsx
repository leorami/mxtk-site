'use client'
import { useCopy } from '@/components/copy/Copy'
import { getApiUrl } from '@/lib/api'
import { scoreWidgetsForOverview } from '@/lib/home/overviewScore'
import type { HomeDoc, Mode as HomeMode, HomePatch, SectionState, UndoFrame } from '@/lib/home/types'
import UndoStack from '@/lib/home/undo'
import * as React from 'react'
import Grid from './Grid'
import SnapshotManager from './SnapshotManager'

type Props = { initialDocId?: string; initialDoc?: HomeDoc | null }

export default function DashboardContent({ initialDocId = 'default', initialDoc = null }: Props) {
  const { mode } = useCopy('dashboard')
  const [doc, setDoc] = React.useState<HomeDoc | null>(initialDoc)
  const [showAdaptCta, setShowAdaptCta] = React.useState(false)
  const [previewDoc, setPreviewDoc] = React.useState<HomeDoc | null>(null)
  const prevModeRef = React.useRef(mode)
  const ctaShownOnce = React.useRef(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [retryCount, setRetryCount] = React.useState(0)
  const lastMutationTs = React.useRef<number>(0)
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
    let beforeOrders: { id: string; order: number }[] = []
    let afterOrders: { id: string; order: number }[] = []
    setDoc(d => {
      if (!d) return d
      const cur = [...d.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      const movingIdx = cur.findIndex(s => s.id === dragSec)
      const targetIdx = cur.findIndex(s => s.id === targetId)
      if (movingIdx < 0 || targetIdx < 0) return d
      beforeOrders = cur.map((s, i) => ({ id: s.id, order: i }))
      const [moving] = cur.splice(movingIdx, 1)
      cur.splice(targetIdx, 0, moving)
      const reindexed = cur.map((s, i) => ({ ...s, order: i }))
      afterOrders = reindexed.map(s => ({ id: s.id, order: s.order }))
      return { ...d, sections: reindexed } as HomeDoc
    })
    try {
      await persistSectionOrders(afterOrders.map(o => ({ id: o.id, order: o.order })) as any)
      pushUndoFrame({ sections: afterOrders as any }, { sections: beforeOrders as any })
    } catch {}
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
    const startedAt = Date.now()
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
        const mappedMode: HomeMode = (mode === 'learn' || mode === 'build' || mode === 'operate') ? (mode as HomeMode) : 'build'
        const seeded = await fetch(getApiUrl(`/ai/home/seed`), {
          method: 'POST',
          headers: { 
            'content-type': 'application/json',
            'x-retry-count': retryCount.toString()
          },
          body: JSON.stringify({ id: initialDocId, mode: mappedMode })
        })
        
        if (!seeded.ok) {
          const errorData = await seeded.json().catch(() => ({ error: 'Unknown error' }))
          console.error('Dashboard: Seed failed', errorData)
          setError(`Failed to seed dashboard: ${errorData.error || 'Unknown error'}`)
          setLoading(false)
          return null
        }
        
        // Get the seeded data directly from the seed response
        const seedData = await seeded.json().catch(() => null)
        if (seedData && !seedData.error) {
          console.log('Dashboard: Seed successful')
          setDoc(seedData as any as import('@/lib/home/types').HomeDoc)
          setLoading(false)
          return seedData as any
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
        // Ignore stale GET that started before a more recent user mutation
        if (startedAt >= lastMutationTs.current) {
          setDoc(j as any)
        }
        return j as any
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

  // --- Undo/Redo ring buffer (persisted per-doc) ----------------------------
  const undoKey = React.useMemo(() => `mxtk:undo:${initialDocId}`, [initialDocId])
  const undoRef = React.useRef<UndoStack | null>(null)
  const [undoState, setUndoState] = React.useState<{ canUndo: boolean; canRedo: boolean }>({ canUndo: false, canRedo: false })

  const postSignal = React.useCallback((payload: any) => {
    try {
      fetch(getApiUrl(`/ai/signals`).replace(/\/api\//, '/api/'), {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: `sig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`, ts: Date.now(), ...payload }), cache: 'no-store'
      }).catch(() => {})
    } catch {}
  }, [])

  const saveUndo = React.useCallback(() => {
    try { if (undoRef.current) localStorage.setItem(undoKey, JSON.stringify(undoRef.current.toJSON())) } catch {}
    if (undoRef.current) setUndoState({ canUndo: undoRef.current.canUndo(), canRedo: undoRef.current.canRedo() })
  }, [undoKey])

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(undoKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        undoRef.current = UndoStack.fromJSON(parsed)
      } else {
        undoRef.current = new UndoStack(50)
      }
    } catch { undoRef.current = new UndoStack(50) }
    saveUndo()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undoKey])

  function computeWidgetsDiff(before: HomeDoc, after: HomeDoc) {
    const mapBefore = new Map(before.widgets.map(w => [w.id, w]))
    const out: any[] = []
    for (const w of after.widgets) {
      const prev = mapBefore.get(w.id)
      if (!prev) continue
      const changedPos = prev.pos.x !== w.pos.x || prev.pos.y !== w.pos.y
      const changedSize = prev.size.w !== w.size.w || prev.size.h !== w.size.h
      const changedTitle = prev.title !== w.title
      const changedSection = prev.sectionId !== w.sectionId
      const changed = changedPos || changedSize || changedTitle || changedSection
      if (changed) {
        out.push({ id: w.id, pos: changedPos ? { ...w.pos } : undefined, size: changedSize ? { ...w.size } : undefined, title: changedTitle ? w.title : undefined, sectionId: changedSection ? w.sectionId : undefined })
      }
    }
    return out
  }

  function applyPatchLocally(base: HomeDoc, patch: HomePatch): HomeDoc {
    let next = { ...base }
    if (Array.isArray(patch.widgets) && patch.widgets.length) {
      const widgets = next.widgets.map(w => ({ ...w }))
      for (const u of patch.widgets as any[]) {
        if (!u?.id) continue
        if ((u as any).remove) {
          const idx = widgets.findIndex(x => x.id === u.id)
          if (idx >= 0) widgets.splice(idx, 1)
          continue
        }
        const idx = widgets.findIndex(x => x.id === u.id)
        if (idx >= 0) {
          const cur = widgets[idx]
          widgets[idx] = {
            ...cur,
            pos: u.pos ? { ...cur.pos, ...u.pos } : cur.pos,
            size: u.size ? { ...cur.size, ...u.size } : cur.size,
            title: typeof u.title !== 'undefined' ? u.title : cur.title,
            sectionId: typeof u.sectionId !== 'undefined' ? String(u.sectionId) : cur.sectionId,
            data: u.data && typeof u.data === 'object' ? { ...(cur.data || {}), ...u.data } : cur.data,
          } as any
        }
      }
      next = { ...next, widgets }
    }
    if (Array.isArray(patch.sections) && patch.sections.length) {
      const sections = next.sections.map(s => ({ ...s }))
      for (const u of patch.sections as any[]) {
        const idx = sections.findIndex(x => x.id === u.id)
        if (idx >= 0) sections[idx] = { ...sections[idx], ...(Object.prototype.hasOwnProperty.call(u, 'collapsed') ? { collapsed: !!(u as any).collapsed } : {}), ...(Object.prototype.hasOwnProperty.call(u, 'order') ? { order: (u as any).order } : {}) }
      }
      next = { ...next, sections }
    }
    return next
  }

  const pushUndoFrame = React.useCallback((patch: HomePatch, inverse: HomePatch) => {
    if (!undoRef.current) return
    const frame: UndoFrame = { id: `uf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`, ts: Date.now(), patch, inverse }
    undoRef.current.push(frame)
    saveUndo()
  }, [saveUndo])

  React.useEffect(() => {
    let alive = true
    
    // Load data and set state only if component is still mounted
    loadData().then(() => {
      if (!alive) return
    })
    
    return () => { alive = false }
  }, [loadData])

  // Client belt-and-suspenders: if cookie missing OR no widgets, seed once and refetch
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem('mxtk_auto_seed_done') === '1') return;
      const hasCookie = /(?:^|; )mxtk_home_id=([^;]+)/.test(document.cookie || '');
      const widgetCount = Array.isArray(doc?.widgets) ? (doc!.widgets as any[]).length : 0;
      if (hasCookie && widgetCount > 0) return;
      (async () => {
        try {
          await fetch(getApiUrl('/ai/home/seed'), {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: doc?.id || 'default', mode, adapt: true }),
            credentials: 'include'
          });
        } catch {}
        try { sessionStorage.setItem('mxtk_auto_seed_done', '1'); } catch {}
        loadData(true);
      })();
    } catch {}
  }, [doc?.id, doc?.widgets, mode, loadData]);

  // Surface Adapt CTA when mode changes or when doc first loads
  React.useEffect(() => {
    if (!doc) return
    const modeChanged = prevModeRef.current !== mode
    if (modeChanged || !ctaShownOnce.current) {
      setShowAdaptCta(false)
      ctaShownOnce.current = true
      prevModeRef.current = mode
    }
  }, [doc, mode])

  const onDismissAdapt = React.useCallback(() => {
    setShowAdaptCta(false)
    setPreviewDoc(null)
  }, [])

  const onPreviewAdapt = React.useCallback(async () => {
    try {
      const { buildSeedDocFromPresets, adaptDocWithPresets } = await import('@/lib/home/seedUtil')
      const base = doc ? { ...doc } : null
      if (!base) return
      // create a virtual merged document without persisting
      const mappedMode: HomeMode = (mode === 'learn' || mode === 'build' || mode === 'operate') ? (mode as HomeMode) : 'build'
      const merged = adaptDocWithPresets(base as any, mappedMode as any)
      setPreviewDoc({ ...merged })
    } catch {}
  }, [doc, mode])

  const onApplyAdapt = React.useCallback(async () => {
    try {
      const mappedMode: HomeMode = (mode === 'learn' || mode === 'build' || mode === 'operate') ? (mode as HomeMode) : 'build'
      await fetch(getApiUrl(`/ai/home/seed`), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: initialDocId, mode: mappedMode, adapt: true }) })
      window.dispatchEvent(new CustomEvent('mxtk-dashboard-refresh', { detail: { source: 'adapt-apply', mode: mappedMode } }))
      setPreviewDoc(null)
      setShowAdaptCta(false)
    } catch {}
  }, [initialDocId, mode])

  // --- Snapshots UI (Save / Restore / Manage) --------------------------------
  const [snapshots, setSnapshots] = React.useState<import('@/lib/home/types').HomeSnapshotMeta[] | null>(null)
  const [openPanel, setOpenPanel] = React.useState<null | 'restore' | 'manage'>(null)
  const [snapModalOpen, setSnapModalOpen] = React.useState(false)
  const fetchingSnaps = React.useRef(false)
  const lastAutoSnapKey = React.useMemo(() => `mxtk.home.autoSnapTs:${initialDocId}`, [initialDocId])

  const fetchSnapshots = React.useCallback(async () => {
    if (fetchingSnaps.current) return
    fetchingSnaps.current = true
    try {
      const res = await fetch(getApiUrl(`/ai/home/${initialDocId}/snapshots`), { cache: 'no-store' })
      if (res.ok) {
        const j = await res.json().catch(() => null)
        if (j && Array.isArray(j.items)) setSnapshots(j.items)
      }
    } finally { fetchingSnaps.current = false }
  }, [initialDocId])

  const saveSnapshotNow = React.useCallback(async (note?: string) => {
    try {
      const res = await fetch(getApiUrl(`/ai/home/${initialDocId}/snapshots`), {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ note: note || undefined })
      })
      if (res.ok) {
        try { window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Snapshot saved' } })) } catch {}
        await fetchSnapshots()
        return true
      }
    } catch {}
    return false
  }, [initialDocId, fetchSnapshots])

  const maybeAutoSnapshot = React.useCallback(async () => {
    try {
      const last = Number(localStorage.getItem(lastAutoSnapKey) || '0')
      const now = Date.now()
      if (!last || (now - last) > 30000) {
        const ok = await saveSnapshotNow('auto')
        if (ok) localStorage.setItem(lastAutoSnapKey, String(now))
      }
    } catch {}
  }, [lastAutoSnapKey, saveSnapshotNow])

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
          pushUndoFrame({ widgets: inverse.map(x => ({ id: x.id, remove: true })) as any }, { widgets: added.map(w => ({ id: w.id })) as any })
        }
      }
    }
    window.addEventListener('mxtk-dashboard-refresh', onRefresh as any)
    return () => window.removeEventListener('mxtk-dashboard-refresh', onRefresh as any)
  }, [doc, loadData, pushUndoFrame])

  // Loading state
  if (loading) {
    return (
      <div className="section-rail">
        {['Overview','Train','Prepare','Conquer','Library'].map(t => (
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
        {['Overview','Train','Prepare','Conquer','Library'].map(t => (
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
      {showAdaptCta && (
        <div className="mb-3 text-sm">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--surface-card-emb)] border border-[color:var(--border-soft)] shadow-sm">
            <span>Adapt the Dashboard</span>
            <button className="btn btn-ghost px-3 py-1" onClick={onPreviewAdapt} data-nodrag>Preview</button>
            <button className="btn btn-ghost px-3 py-1" onClick={onDismissAdapt} data-nodrag>Dismiss</button>
            <button className="btn btn-ghost btn-default px-3 py-1" onClick={onApplyAdapt} data-nodrag>Apply</button>
          </div>
        </div>
      )}
      {/* Undo banner removed; controls live in section header tool row when Guide open */}
      {(previewDoc || doc)?.sections.map((sec) => {
        let widgets = (previewDoc || doc)!.widgets.filter(w => w.sectionId === sec.id)
        // If Overview missing widgets, prefill from recommendations (idempotent: computed only for render)
        if (sec.key === 'overview' && widgets.length === 0 && doc) {
          const mappedMode: HomeMode = (mode === 'learn' || mode === 'build' || mode === 'operate') ? (mode as HomeMode) : 'build'
          const scored = scoreWidgetsForOverview(doc.widgets, mappedMode)
          widgets = scored.slice(0, 8).map(s => s.w)
        }
        return (
          <section id={sec.id} key={sec.id} className="glass glass--panel px-4 py-3 md:px-5 md:py-4 mb-5 rounded-xl">
            <header
              className={`wf-head ${sec.collapsed ? 'flex' : 'sr-only md:flex md:opacity-70 md:h-8'} items-center justify-between mb-3`}
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
                      persistSectionOrders(re)
                        .then(() => { pushUndoFrame({ sections: re.map(s => ({ id: s.id, order: s.order })) as any }, { sections: before as any }) })
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
                  className="chip inline-flex px-2 py-0.5 rounded-full border text-xs"
                  aria-label={sec.collapsed ? 'Expand section' : 'Collapse section'}
                  aria-expanded={!sec.collapsed}
                  onClick={(e) => { e.preventDefault(); toggleCollapse(sec.id); }}
                >{sec.collapsed ? '+' : '−'}</button>
                {/* Snapshots control group: visible only when Guide is open */}
                <div className="hidden snapshots-ctl-group" data-nodrag>
                  <style jsx global>{`
                    html.guide-open .snapshots-ctl-group { display: inline-flex !important; gap: 6px; }
                    html.guide-open .undo-ctl-group { display: inline-flex !important; gap: 6px; }
                    .snapshots-ctl-group button { cursor: pointer; }
                  `}</style>
                  <span className="undo-ctl-group">
                    <button
                      className="btn btn-sm"
                      disabled={!undoState.canUndo}
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (!undoRef.current || !doc) return
                        const state = undoRef.current.toJSON()
                        const curIdx = state.pointer
                        if (curIdx < 0) return
                        const frame = state.frames[curIdx]
                        const before = doc
                        const locally = applyPatchLocally(before, frame.inverse)
                        setDoc(locally)
                        try {
                          // Persist inverse
                          const body: any = {}
                          if (frame.inverse.widgets?.length) body.widgets = frame.inverse.widgets
                          if (frame.inverse.sections?.length) body.sections = frame.inverse.sections
                          const res = await fetch(getApiUrl(`/ai/home/${initialDocId}`), { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
                          if (!res.ok) throw new Error('PATCH failed')
                          // Advance pointer only on success
                          undoRef.current.undo()
                          saveUndo()
                          postSignal({ kind: 'undo', docId: initialDocId })
                        } catch {
                          // Revert local UI if persist failed
                          setDoc(before)
                        }
                      }}
                      data-nodrag
                    >Undo</button>
                    <button
                      className="btn btn-sm"
                      disabled={!undoState.canRedo}
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (!undoRef.current || !doc) return
                        const state = undoRef.current.toJSON()
                        const nextIdx = state.pointer + 1
                        const frame = state.frames[nextIdx]
                        if (!frame) return
                        const before = doc
                        const locally = applyPatchLocally(before, frame.patch)
                        setDoc(locally)
                        try {
                          const body: any = {}
                          if (frame.patch.widgets?.length) body.widgets = frame.patch.widgets
                          if (frame.patch.sections?.length) body.sections = frame.patch.sections
                          const res = await fetch(getApiUrl(`/ai/home/${initialDocId}`), { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
                          if (!res.ok) throw new Error('PATCH failed')
                          undoRef.current.redo()
                          saveUndo()
                          postSignal({ kind: 'redo', docId: initialDocId })
                        } catch {
                          setDoc(before)
                        }
                      }}
                      data-nodrag
                    >Redo</button>
                  </span>
                  <button
                    className="btn btn-sm"
                    onClick={(e) => { e.stopPropagation(); const note = window.prompt('Snapshot note (optional)') || undefined; void saveSnapshotNow(note); }}
                    data-nodrag
                  >Save</button>
                  <button
                    className="btn btn-sm"
                    onClick={async (e) => { e.stopPropagation(); await fetchSnapshots(); setOpenPanel(p => p === 'restore' ? null : 'restore'); }}
                    data-nodrag
                  >Restore</button>
                  <button
                    className="btn btn-sm"
                    onClick={async (e) => { e.stopPropagation(); setSnapModalOpen(true); }}
                    data-nodrag
                  >Manage</button>
                </div>
              </div>
            </header>
            {/* Minimal popover/list for Restore/Manage */}
            {openPanel && guideOpen && (
              <div className="mb-2 text-xs" data-nodrag onClick={(e) => e.stopPropagation()}>
                <div className="rounded-lg border p-2 bg-[color:var(--surface-card)]/60">
                  {!snapshots && <div className="opacity-70">Loading…</div>}
                  {snapshots && snapshots.length === 0 && <div className="opacity-70">No snapshots</div>}
                  {snapshots && snapshots.length > 0 && (
                    <ul className="space-y-1">
                      {snapshots.map(s => (
                        <li key={s.id} className="flex items-center justify-between gap-2">
                          <button
                            className="text-left flex-1 underline hover:no-underline"
                            onClick={async () => {
                              if (openPanel === 'restore') {
                                await maybeAutoSnapshot();
                                const res = await fetch(getApiUrl(`/ai/home/${initialDocId}/snapshots/${s.id}`), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) })
                                if (res.ok) {
                                  const j = await res.json().catch(() => null)
                                  if (j?.doc) setDoc(j.doc)
                                  setOpenPanel(null)
                                  try { window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Snapshot restored' } })) } catch {}
                                }
                              }
                            }}
                            data-nodrag
                          >{new Date(s.createdAt).toLocaleString()} {s.note ? `— ${s.note}` : ''}</button>
                          {openPanel === 'manage' && (
                            <button
                              className="opacity-70 hover:opacity-100"
                              title="Delete snapshot"
                              onClick={async () => {
                                if (!confirm('Delete this snapshot?')) return
                                await fetch(getApiUrl(`/ai/home/${initialDocId}/snapshots/${s.id}`), { method: 'DELETE' })
                                await fetchSnapshots()
                              }}
                              data-nodrag
                            >✕</button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            {/* drop also works on header; no extra target needed */}
            {!sec.collapsed && (
              <div className="section-body">
                <Grid doc={{ ...(previewDoc || doc)!, widgets }} onPatch={async (_id, updates) => {
                  const beforeDoc = doc!
                  // Optimistic local apply
                  setDoc(d => {
                    if (!d) return d
                    return applyPatchLocally(d, { widgets: updates as any })
                  })
                  lastMutationTs.current = Date.now()
                  try {
                    const res = await fetch(getApiUrl(`/ai/home/${initialDocId}`), { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widgets: updates }) })
                    if (!res.ok) throw new Error('PATCH failed')
                    // Build inverse from captured before, and patch from updates
                    const inverse = updates.map(u => {
                      const cur = beforeDoc.widgets.find(w => w.id === u.id)
                      return cur ? { id: cur.id, pos: u.pos ? { ...cur.pos } : undefined, size: u.size ? { ...cur.size } : undefined } : { id: u.id }
                    }) as any
                    pushUndoFrame({ widgets: updates as any }, { widgets: inverse as any })
                    postSignal({ kind: updates.some(u => u.size) ? 'resize' : 'move', docId: initialDocId })
                  } catch (e) {
                    // Revert local state on failure
                    setDoc(beforeDoc)
                  }
                }} />
              </div>
            )}
          </section>
        )
      })}
      <SnapshotManager
        open={snapModalOpen}
        docId={initialDocId}
        onClose={() => setSnapModalOpen(false)}
        onRestored={(d) => {
          const before = doc
          setDoc(d)
          if (before) {
            const inv: HomePatch = { widgets: before.widgets.map(w => ({ id: w.id, pos: { ...w.pos }, size: { ...w.size }, title: w.title, sectionId: w.sectionId })) as any, sections: before.sections.map(s => ({ id: s.id, order: s.order, collapsed: s.collapsed })) as any }
            const patch: HomePatch = { widgets: d.widgets.map(w => ({ id: w.id, pos: { ...w.pos }, size: { ...w.size }, title: w.title, sectionId: w.sectionId })) as any, sections: d.sections.map(s => ({ id: s.id, order: s.order, collapsed: s.collapsed })) as any }
            pushUndoFrame(patch, inv)
          }
        }}
      />
    </div>
  )
}