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

  const [fade, setFade] = React.useState({ top: false, bottom: false, scrollable: false });
  const handleScrollState = React.useCallback((s: { scrollable: boolean; atTop: boolean; atBottom: boolean }) => {
    setFade({
      scrollable: s.scrollable,
      top: s.scrollable && !s.atTop,
      bottom: s.scrollable && !s.atBottom,
    });
  }, []);

  return (
    <div className="relative h-full wframe">
      {/* Header row: title + actions; actions marked no-drag */}
      <header className="wf-head flex items-center justify-between">
        <div className="wf-title truncate">{localTitle}</div>
        <div className="wf-actions wframe-controls widget-controls inline-flex items-center gap-1" data-nodrag>
          {onRefresh && (
            <button type="button" className="iconbtn" title="Refresh" data-nodrag onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onRefresh?.(); }}>↻</button>
          )}
          <button type="button" className="iconbtn" title="Settings" data-nodrag onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }} aria-haspopup="dialog" aria-expanded={open ? 'true' : 'false'}>⚙︎</button>
          {onInfo && (<button type="button" className="iconbtn" title="Info" data-nodrag onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onInfo?.(); }}>i</button>)}
          {onRemove && (<button type="button" className="iconbtn" title="Remove" data-nodrag onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onRemove?.(); }}>✕</button>)}
        </div>
      </header>

      <ScrollBody densityClass={bodyDensityClass} onState={handleScrollState}>
        {children}
      </ScrollBody>

      {/* Non-scrolling fades pinned to the frame */}
      <div aria-hidden className="scroll-fade top" style={{ opacity: fade.top ? 1 : 0 }} />
      <div aria-hidden className="scroll-fade bottom" style={{ opacity: fade.bottom ? 1 : 0 }} />

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

function ScrollBody({ densityClass, children, onState }: { densityClass: string; children: React.ReactNode; onState?: (s: { scrollable: boolean; atTop: boolean; atBottom: boolean }) => void }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [state, setState] = React.useState({ scrollable: false, atTop: true, atBottom: false });
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    function update() {
      const scrollable = el.scrollHeight > el.clientHeight + 1;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      setState({ scrollable, atTop, atBottom });
      el.dataset.scrollable = scrollable ? 'true' : 'false';
      el.dataset.atTop = atTop ? 'true' : 'false';
      el.dataset.atBottom = atBottom ? 'true' : 'false';
      try { onState?.({ scrollable, atTop, atBottom }); } catch {}
    }
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update); ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [children, onState]);
  return (
    <div ref={ref} className={`widget-body wframe-body ${densityClass}`} data-widget-body>
      {children}
    </div>
  );
}