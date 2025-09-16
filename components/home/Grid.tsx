'use client';

import WidgetFrame from '@/components/home/WidgetFrame';
import GlossarySpotlight from '@/components/home/widgets/GlossarySpotlight';
import PoolsMini from '@/components/home/widgets/PoolsMini';
import PoolsTable from '@/components/home/widgets/PoolsTable';
import PriceLarge from '@/components/home/widgets/PriceLarge';
import PriceMini from '@/components/home/widgets/PriceMini';
import RecentAnswers from '@/components/home/widgets/RecentAnswers';
import Resources from '@/components/home/widgets/Resources';
import TopPoolsList from '@/components/home/widgets/TopPoolsList';
import WhatsNext from '@/components/home/widgets/WhatsNext';
import { useToast } from '@/components/ui/Toast';
import { getApiPath } from '@/lib/basepath';
import type { HomeDoc, WidgetState } from '@/lib/home/types';
import * as React from 'react';

type GridProps = {
  doc: HomeDoc;                              // expects V2 with sections + widgets
  render?: (w: WidgetState) => React.ReactNode;
  // you can inject a custom onPatch later; default uses /api/ai/home/[id]
  onPatch?: (docId: string, widgets: Partial<WidgetState>[]) => Promise<void>;
};

function api(path: string) {
  return getApiPath(path);
}

const DEFAULT_COLS = 12;

function useGuideOpen(): boolean {
  const [open, setOpen] = React.useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('guide-open') : false
  );

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const obs = new MutationObserver(() => setOpen(root.classList.contains('guide-open')));
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
    setOpen(root.classList.contains('guide-open'));
    return () => obs.disconnect();
  }, []);

  return open;
}

export default function Grid({ doc, render, onPatch }: GridProps) {
  const guideOpen = useGuideOpen();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { show } = useToast();
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width:640px)');
    const update = () => setIsMobile(!!mql.matches);
    update();
    try { mql.addEventListener('change', update); } catch { mql.addListener(update); }
    return () => { try { mql.removeEventListener('change', update); } catch { mql.removeListener(update); } };
  }, []);

  // Local working copy so drag/resize updates re-render immediately
  const [widgets, setWidgets] = React.useState<WidgetState[]>(doc.widgets);
  React.useEffect(() => { setWidgets(doc.widgets); }, [doc.widgets]);

  // Per-widget refresh ticks to trigger refetch in child components
  const [refreshTicks, setRefreshTicks] = React.useState<Record<string, number>>({});

  // grid metrics
  const gridCols = React.useRef(DEFAULT_COLS);
  const colW = React.useRef(0);
  const rowH = React.useRef(8); // px, matches --row-h default
  const [cols, setCols] = React.useState<number>(DEFAULT_COLS)

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    // infer columns from computed grid-template-columns
    const tmpl = cs.getPropertyValue('grid-template-columns');
    const count = tmpl ? tmpl.split(' ').filter(Boolean).length : DEFAULT_COLS;
    gridCols.current = count || DEFAULT_COLS;
    setCols(gridCols.current)

    colW.current = el.clientWidth / gridCols.current;

    const rh = parseFloat(cs.getPropertyValue('--row-h')) || 8;
    rowH.current = rh;
  });

  // --- debounced PATCH -------------------------------------------------------
  const pending = React.useRef<Partial<WidgetState>[] | null>(null);
  const debTimer = React.useRef<number | null>(null);
  const doPatch = React.useCallback(async (batch: Partial<WidgetState>[]) => {
    try {
      // Before a batch that may move/resize, trigger a lightweight auto snapshot (debounced elsewhere)
      try {
        const key = `mxtk.home.autoSnapTs:${doc.id}`;
        const last = Number(localStorage.getItem(key) || '0');
        const now = Date.now();
        if (!last || (now - last) > 30000) {
          localStorage.setItem(key, String(now));
          // Fire-and-forget; rely on server no-store
          fetch(getApiPath(`/api/ai/home/${doc.id}/snapshots`), {
            method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ note: 'auto' })
          }).catch(() => {});
        }
      } catch {}
      if (onPatch) {
        await onPatch(doc.id, batch);
        return;
      }
      await fetch(api(`/api/ai/home/${doc.id}`), {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ widgets: batch }),
        cache: 'no-store',
      });
    } catch (e) {
      // swallow for now; next wave: optimistic rollback + toast
      console.error('home PATCH failed', e);
    }
  }, [doc.id, onPatch]);

  function queuePatch(updates: Partial<WidgetState>[]) {
    if (debTimer.current) window.clearTimeout(debTimer.current);
    pending.current = updates;
    debTimer.current = window.setTimeout(() => {
      const p = pending.current;
      if (p) doPatch(p);
      debTimer.current = null;
      pending.current = null;
    }, 600);
  }

  // Flush any pending updates on unmount (navigation/refresh) to avoid lost changes
  React.useEffect(() => {
    return () => {
      if (debTimer.current && pending.current) {
        // best effort, fire-and-forget
        void doPatch(pending.current);
        debTimer.current = null;
        pending.current = null;
      }
    };
  }, [doPatch]);

  // --- helpers ---------------------------------------------------------------
  function clampPos(w: WidgetState, nextX: number, nextY: number) {
    const cols = gridCols.current;
    const width = Math.max(1, Math.min(w.size?.w ?? 3, cols));
    return {
      x: Math.max(0, Math.min(nextX, cols - width)),
      y: Math.max(0, nextY),
    };
  }

  function clampSize(nextW: number, nextH: number) {
    const cols = gridCols.current;
    const W = Math.max(1, Math.min(nextW, cols));
    const H = Math.max(1, nextH);
    return { w: W, h: H };
  }

  // --- drag / resize state ---------------------------------------------------
  const dragId = React.useRef<string | null>(null);
  const dragStart = React.useRef<{ x: number; y: number; pos: { x: number; y: number } } | null>(null);

  const resizeId = React.useRef<string | null>(null);
  const resizeDir = React.useRef<'br'|'tr'|'bl'|'tl'|null>(null);
  const resizeStart = React.useRef<{ x: number; y: number; size: { w: number; h: number }; pos: { x:number; y:number } } | null>(null);

  // --- signals minimal debounce ---------------------------------------------
  function genId() { return `sig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}` }
  const postTimer = React.useRef<number | null>(null)
  const postSignal = React.useCallback((payload: any) => {
    if (postTimer.current) window.clearTimeout(postTimer.current)
    postTimer.current = window.setTimeout(() => {
      fetch(getApiPath('/api/ai/signals'), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: genId(), ts: Date.now(), ...payload }), cache: 'no-store'
      }).catch(() => {})
      postTimer.current = null
    }, 150)
  }, [])

  React.useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!containerRef.current) return;
      if (dragId.current) {
        const id = dragId.current;
        const ds = dragStart.current!;
        const dx = e.clientX - ds.x;
        const dy = e.clientY - ds.y;
        const dCols = Math.round(dx / (colW.current || 1));
        const dRows = Math.round(dy / (rowH.current || 8));

        setWidgets(prev => prev.map(w => {
          if (w.id !== id) return w;
          const np = clampPos(w, (ds.pos?.x ?? w.pos.x) + dCols, (ds.pos?.y ?? w.pos.y) + dRows);
          return { ...w, pos: np };
        }));
      } else if (resizeId.current) {
        const id = resizeId.current;
        const rs = resizeStart.current!;
        const dx = e.clientX - rs.x;
        const dy = e.clientY - rs.y;
        const dCols = Math.round(dx / (colW.current || 1));
        const dRows = Math.round(dy / (rowH.current || 8));

        setWidgets(prev => prev.map(w => {
          if (w.id !== id) return w;
          const from = resizeDir.current || 'br';
          let nextW = rs.size.w;
          let nextH = rs.size.h;
          let nextX = rs.pos.x;
          let nextY = rs.pos.y;
          // Horizontal
          if (from === 'br' || from === 'tr') {
            nextW = rs.size.w + dCols;
          } else { // from left
            nextW = rs.size.w - dCols;
            nextX = rs.pos.x + dCols;
          }
          // Vertical
          if (from === 'br' || from === 'bl') {
            nextH = rs.size.h + dRows;
          } else { // from top
            nextH = rs.size.h - dRows;
            nextY = rs.pos.y + dRows;
          }
          const ns = clampSize(nextW, nextH);
          const np = clampPos(w, nextX, nextY);
          return { ...w, size: ns, pos: np };
        }));
      }
    }
    function onUp() {
      if (dragId.current) {
        const id = dragId.current;
        dragId.current = null;
        const w = widgets.find(x => x.id === id);
        if (w) {
          // Persist immediately on drag end
          void doPatch([{ id: w.id, pos: w.pos }]);
          postSignal({ kind: 'move', docId: doc.id, widgetId: w.id, pos: { x: w.pos.x, y: w.pos.y }, size: { w: w.size.w, h: w.size.h } })
        }
      }
      if (resizeId.current) {
        const id = resizeId.current;
        resizeId.current = null;
        const w = widgets.find(x => x.id === id);
        if (w) {
          // Persist immediately on resize end
          void doPatch([{ id: w.id, size: w.size }]);
          postSignal({ kind: 'resize', docId: doc.id, widgetId: w.id, pos: { x: w.pos.x, y: w.pos.y }, size: { w: w.size.w, h: w.size.h } })
        }
      }
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [widgets, queuePatch]);

  function startDrag(e: React.PointerEvent, w: WidgetState) {
    // Mobile lockout regardless of guide state
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      show('Edit layout on tablet/desktop.');
      return;
    }
    // Gate to Guide open and honor data-nodrag
    if (!guideOpen) return;
    const t = e.target as HTMLElement;
    // Only allow initiating drag from header handle area to avoid accidental drags
    if (!t.closest('.wf-head')) return;
    if (t.closest('[data-nodrag]') || t.closest('.wframe-controls')) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragId.current = w.id;
    dragStart.current = { x: e.clientX, y: e.clientY, pos: { ...w.pos } };
  }

  function startResize(e: React.PointerEvent, w: WidgetState, dir: 'br'|'tr'|'bl'|'tl' = 'br') {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      show('Edit layout on tablet/desktop.');
      return;
    }
    if (!guideOpen) return;
    e.stopPropagation();
    const t = e.target as HTMLElement;
    if (t.closest('[data-nodrag]')) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    resizeId.current = w.id;
    resizeDir.current = dir;
    resizeStart.current = { x: e.clientX, y: e.clientY, size: { ...w.size }, pos: { ...w.pos } };
  }

  function onKey(e: React.KeyboardEvent, w: WidgetState) {
    if (!guideOpen) return;
    let handled = false;
    const withShift = e.shiftKey;

    if (withShift) {
      // resize
      if (e.key === 'ArrowRight') { setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, size: clampSize(x.size.w + 1, x.size.h) } : x)); handled = true; }
      if (e.key === 'ArrowLeft')  { setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, size: clampSize(x.size.w - 1, x.size.h) } : x)); handled = true; }
      if (e.key === 'ArrowDown')  { setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, size: clampSize(x.size.w, x.size.h + 1) } : x)); handled = true; }
      if (e.key === 'ArrowUp')    { setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, size: clampSize(x.size.w, x.size.h - 1) } : x)); handled = true; }
      if (handled) queuePatch([{ id: w.id, size: widgets.find(x => x.id === w.id)?.size } as any]);
    } else {
      // move
      if (e.key === 'ArrowRight') { setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, pos: clampPos(x, x.pos.x + 1, x.pos.y) } : x)); handled = true; }
      if (e.key === 'ArrowLeft')  { setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, pos: clampPos(x, x.pos.x - 1, x.pos.y) } : x)); handled = true; }
      if (e.key === 'ArrowDown')  { setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, pos: clampPos(x, x.pos.x, x.pos.y + 1) } : x)); handled = true; }
      if (e.key === 'ArrowUp')    { setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, pos: clampPos(x, x.pos.x, x.pos.y - 1) } : x)); handled = true; }
      if (handled) queuePatch([{ id: w.id, pos: widgets.find(x => x.id === w.id)?.pos } as any]);
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  const isSingleCol = cols <= 1

  // Runtime guard for mobile: ensure no overlaps by pushing down and persisting
  React.useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const cs = getComputedStyle(el)
    const colCount = (cs.getPropertyValue('grid-template-columns') || '').trim().split(' ').filter(Boolean).length
    if (colCount > 1) return
    // Single-column: recompute sequential rows
    setWidgets(prev => {
      let y = 0
      const next = prev.map(w => {
        const spanH = Math.max(1, w.size?.h ?? 12)
        const out = { ...w, pos: { x: 0, y } }
        y += spanH
        return out
      })
      // Persist positions (debounced)
      queuePatch(next.map(w => ({ id: w.id, pos: w.pos })))
      return next
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSingleCol])

  return (
    <div ref={containerRef} className="section-grid mxtk-grid" data-grid role="list">
      {isSingleCol ? (() => { let rowCursor = 1; return widgets.map((w) => {
        const spanH = Math.max(1, w.size?.h ?? 12);
        const startRow = rowCursor;
        rowCursor += spanH;
        return (
          <div
            key={w.id}
            role="listitem"
            tabIndex={0}
            className="widget-tile widget-cell"
            style={{
              gridColumn: `1 / -1`,
              gridRow: `${startRow} / span ${spanH}`,
            }}
            data-widget-id={w.id}
            onKeyDown={(e) => onKey(e, w)}
          >
            {/* Indicators at outermost container */}
            <div className="scroll-indicator top" aria-hidden="true" />
            {/* Outer shell only owns border */}
            <div className="wframe-shell" style={{ border: 'none' }}>
              {/* drag surface wraps the widget frame to enable move; only head is handle */}
              <div className="widget-chrome" onPointerDown={(e) => startDrag(e, w)}>
                <WidgetFrame
                  id={w.id}
                  docId={doc.id}
                  title={w.title}
                  data={w.data as any}
                  onRefresh={() => setRefreshTicks(prev => ({ ...prev, [w.id]: (prev[w.id] || 0) + 1 }))}
                >
                {render
                  ? render(w)
                  : (
                    w.type === 'recent-answers' ? (
                      <RecentAnswers key={`ra-${w.id}:${refreshTicks[w.id] || 0}`} />
                    ) : w.type === 'resources' ? (
                      <Resources id={w.id} data={w.data as any} />
                    ) : w.type === 'glossary-spotlight' ? (
                      <GlossarySpotlight id={w.id} data={w.data as any} />
                    ) : w.type === 'pools-mini' ? (
                      <PoolsMini id={w.id} docId={doc.id} data={w.data as any} refreshKey={refreshTicks[w.id] || 0} />
                    ) : w.type === 'price-mini' ? (
                      <PriceMini id={w.id} docId={doc.id} data={w.data as any} refreshKey={refreshTicks[w.id] || 0} />
                    ) : w.type === 'price-large' ? (
                      <PriceLarge key={`pl-${w.id}:${refreshTicks[w.id] || 0}`} id={w.id} data={w.data as any} />
                    ) : w.type === 'pools-table' ? (
                      <PoolsTable id={w.id} data={w.data as any} />
                    ) : w.type === 'whats-next' ? (
                      <WhatsNext />
                    ) : (
                      <div className="p-3 text-sm opacity-70">Widget <code>{w.type}</code></div>
                    )
                  )}
                </WidgetFrame>
              </div>
            </div>
            <div className="scroll-indicator bottom" aria-hidden="true" />

            {/* resizer handle (bottom-right) - only show when Sherpa is open */}
            {guideOpen && (
              <>
                <button
                  type="button"
                  className="wframe-resize br"
                  aria-label="Resize widget"
                  onPointerDown={(e) => startResize(e, w, 'br')}
                />
                <button
                  type="button"
                  className="wframe-resize tr"
                  aria-label="Resize widget from top-right"
                  onPointerDown={(e) => startResize(e, w, 'tr')}
                />
                <button
                  type="button"
                  className="wframe-resize bl"
                  aria-label="Resize widget from bottom-left"
                  onPointerDown={(e) => startResize(e, w, 'bl')}
                />
                <button
                  type="button"
                  className="wframe-resize tl"
                  aria-label="Resize widget from top-left"
                  onPointerDown={(e) => startResize(e, w, 'tl')}
                />
              </>
            )}
          </div>
        );
      }); })() : widgets.map((w) => {
        // Force spans: match your CSS (grid uses var(--row-h))
        const spanW = Math.max(1, w.size?.w ?? 3);
        const spanH = Math.max(1, w.size?.h ?? 12);
        const startCol = Math.max(1, (w.pos?.x ?? 0) + 1);
        const startRow = Math.max(1, (w.pos?.y ?? 0) + 1);

        return (
          <div
            key={w.id}
            role="listitem"
            tabIndex={0}
            className="widget-tile widget-cell"
            style={{
              // Explicit placement and spans so drag/resize are reflected visually
              gridColumn: `${startCol} / span ${spanW}`,
              gridRow: `${startRow} / span ${spanH}`,
            }}
            data-widget-id={w.id}
            onKeyDown={(e) => onKey(e, w)}
          >
            {/* Indicators at outermost container */}
            <div className="scroll-indicator top" aria-hidden="true" />
            {/* Outer shell only owns border */}
            <div className="wframe-shell" style={{ border: 'none' }}>
              {/* drag surface wraps the widget frame to enable move; only head is handle */}
              <div className="widget-chrome" onPointerDown={(e) => startDrag(e, w)}>
                <WidgetFrame
                  id={w.id}
                  docId={doc.id}
                  title={w.title}
                  data={w.data as any}
                  onRefresh={() => setRefreshTicks(prev => ({ ...prev, [w.id]: (prev[w.id] || 0) + 1 }))}
                >
                {render
                  ? render(w)
                  : (
                    w.type === 'recent-answers' ? (
                      <RecentAnswers key={`ra-${w.id}:${refreshTicks[w.id] || 0}`} />
                    ) : w.type === 'resources' ? (
                      <Resources id={w.id} data={w.data as any} />
                    ) : w.type === 'glossary-spotlight' ? (
                      <GlossarySpotlight id={w.id} data={w.data as any} />
                    ) : w.type === 'pools-mini' ? (
                      <PoolsMini id={w.id} docId={doc.id} data={w.data as any} refreshKey={refreshTicks[w.id] || 0} />
                    ) : w.type === 'price-mini' ? (
                      <PriceMini id={w.id} docId={doc.id} data={w.data as any} refreshKey={refreshTicks[w.id] || 0} />
                    ) : w.type === 'price-large' ? (
                      <PriceLarge key={`pl-${w.id}:${refreshTicks[w.id] || 0}`} id={w.id} data={w.data as any} />
                    ) : w.type === 'top-pools-list' ? (
                      <TopPoolsList id={w.id} data={w.data as any} />
                    ) : w.type === 'pools-table' ? (
                      <PoolsTable id={w.id} data={w.data as any} />
                    ) : (
                      <div className="p-3 text-sm opacity-70">Widget <code>{w.type}</code></div>
                    )
                  )}
                </WidgetFrame>
              </div>
            </div>
            <div className="scroll-indicator bottom" aria-hidden="true" />

            {/* resizer handle (bottom-right) - only show when Sherpa is open */}
            {guideOpen && (
              <>
                <button
                  type="button"
                  className="wframe-resize br"
                  aria-label="Resize widget"
                  onPointerDown={(e) => startResize(e, w, 'br')}
                />
                <button
                  type="button"
                  className="wframe-resize tr"
                  aria-label="Resize widget from top-right"
                  onPointerDown={(e) => startResize(e, w, 'tr')}
                />
                <button
                  type="button"
                  className="wframe-resize bl"
                  aria-label="Resize widget from bottom-left"
                  onPointerDown={(e) => startResize(e, w, 'bl')}
                />
                <button
                  type="button"
                  className="wframe-resize tl"
                  aria-label="Resize widget from top-left"
                  onPointerDown={(e) => startResize(e, w, 'tl')}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}