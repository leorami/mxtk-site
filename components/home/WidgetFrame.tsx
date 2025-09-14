'use client';

import { getApiPath } from '@/lib/basepath';
import * as React from 'react';

type Density = 'compact' | 'cozy';

type Props = {
  id?: string;
  docId?: string;
  data?: { density?: Density } | Record<string, unknown>;
  title?: string;
  children?: React.ReactNode;
  onRefresh?: () => void;
  onInfo?: () => void;
  onRemove?: () => void;
};

function getHomeIdFallback(): string {
  try {
    const m = document.cookie.match(/(?:^|; )mxtk_home_id=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : 'default';
  } catch { return 'default'; }
}

export default function WidgetFrame({ id, docId, data, title, children, onRefresh, onInfo, onRemove }: Props) {
  const guideOpen = React.useMemo(() => {
    if (typeof document === 'undefined') return false
    try { return document.documentElement.classList.contains('guide-open') } catch { return false }
  }, [])
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const obs = new MutationObserver(() => {
      const open = root.classList.contains('guide-open')
      setGuideState(open)
    })
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  const [guideState, setGuideState] = React.useState<boolean>(guideOpen)
  function genId() { return `sig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}` }
  const postSignal = React.useCallback((payload: any) => {
    try {
      fetch(getApiPath('/api/ai/signals'), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: genId(), ts: Date.now(), ...payload }), cache: 'no-store'
      }).catch(() => {})
    } catch {}
  }, [])
  const [open, setOpen] = React.useState(false);
  const [localTitle, setLocalTitle] = React.useState<string | undefined>(title);
  const [density, setDensity] = React.useState<Density>(() => (data as any)?.density === 'compact' ? 'compact' : 'cozy');
  React.useEffect(() => { setLocalTitle(title); }, [title]);

  // Visibility is CSS-driven via html.guide-open; no inline gating to avoid SSR timing

  const save = React.useCallback(async () => {
    if (!id) return;
    const homeId = docId || getHomeIdFallback();
    try {
      await fetch(getApiPath(`/api/ai/home/${encodeURIComponent(homeId)}`), {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ widgets: [{ id, title: localTitle, data: { ...(data || {}), density } }] })
      });
    } catch { /* no-op */ }
  }, [id, docId, localTitle, density, data]);

  const bodyDensityClass = density === 'compact' ? 'space-y-2 text-sm' : 'space-y-3';

  // Removed decorative scroll fades to prevent visual clipping of shadows

  return (
    <div className="relative h-full wframe">
      {/* Header row: title + actions; actions marked no-drag */}
      <header className="wf-head flex items-center justify-between">
        <div className="wf-title truncate">{localTitle}</div>
        <div className="wf-actions wframe-controls widget-controls inline-flex items-center gap-1 opacity-0 pointer-events-none [html.guide-open_&]:opacity-100 [html.guide-open_&]:pointer-events-auto transition-opacity" data-nodrag>
            {onRefresh && (
              <button type="button" className="iconbtn" title="Refresh" data-nodrag onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onRefresh?.(); if (id) postSignal({ kind: 'refresh', docId: docId || getHomeIdFallback(), widgetId: id }); }}>
                ↻
              </button>
            )}
            <button type="button" className="iconbtn" title="Settings" data-nodrag onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setOpen(o => !o); if (id) postSignal({ kind: 'settings', docId: docId || getHomeIdFallback(), widgetId: id }); }} aria-haspopup="dialog" aria-expanded={open ? 'true' : 'false'}>⚙︎</button>
            {onInfo && (
              <button type="button" className="iconbtn" title="Info" data-nodrag onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onInfo?.(); }}>i</button>
            )}
            {onRemove && (
              <button type="button" className="iconbtn" title="Remove" data-nodrag onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onRemove?.(); }}>✕</button>
            )}
        </div>
      </header>

      <ScrollBody densityClass={bodyDensityClass}>
        {children}
      </ScrollBody>

      {/* No extra overlays */}

      {open && (
        <div className="absolute top-8 right-2 z-10 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card-emb)] shadow p-3 min-w-[220px]">
          <div className="field mb-2">
            <label className="label">Title</label>
            <input className="input" value={localTitle || ''} onChange={e => setLocalTitle(e.currentTarget.value)} placeholder="Widget title" />
          </div>
          <div className="field mb-3">
            <label className="label">Density</label>
            <div className="inline-flex gap-2">
              <label className="inline-flex items-center gap-1 text-sm">
                <input type="radio" name={`density-${id}`} checked={density === 'compact'} onChange={() => setDensity('compact')} />
                Compact
              </label>
              <label className="inline-flex items-center gap-1 text-sm">
                <input type="radio" name={`density-${id}`} checked={density === 'cozy'} onChange={() => setDensity('cozy')} />
                Cozy
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Close</button>
            <button className="btn btn-primary" onClick={() => { save(); setOpen(false); }}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScrollBody({ densityClass, children }: { densityClass: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const frame = el.closest('.widget-tile') as HTMLElement | null;
    const update = () => {
      if (!frame) return;
      const isScrollable = el.scrollHeight > el.clientHeight + 1;
      const atTop = el.scrollTop <= 0;
      const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
      frame.dataset.scrollable = String(isScrollable);
      frame.dataset.atTop = String(atTop);
      frame.dataset.atBottom = String(atBottom);
    };
    update();
    const onScroll = () => update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => { ro.disconnect(); el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', update); };
  }, [children]);
  return (
    <div ref={ref} className={`widget-body wframe-body ${densityClass}`} data-widget-body>
      {children}
    </div>
  );
}