'use client';

import type { HomeDoc, WidgetState } from '@/lib/home/types';
import * as React from 'react';

type GridProps = {
  doc: HomeDoc;                              // expects V2 with sections + widgets
  render?: (w: WidgetState) => React.ReactNode;
  // you can inject a custom onPatch later; default uses /api/ai/home/[id]
  onPatch?: (docId: string, widgets: Partial<WidgetState>[]) => Promise<void>;
};

function api(path: string) {
  // BasePath-safe for root and /mxtk
  // If you already set __mx_basePath elsewhere, this respects it.
  return (globalThis as any).__mx_basePath ? `${(globalThis as any).__mx_basePath}${path}` : path;
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

  // Local working copy so drag/resize updates re-render immediately
  const [widgets, setWidgets] = React.useState<WidgetState[]>(doc.widgets);
  React.useEffect(() => { setWidgets(doc.widgets); }, [doc.widgets]);

  // grid metrics
  const gridCols = React.useRef(DEFAULT_COLS);
  const colW = React.useRef(0);
  const rowH = React.useRef(8); // px, matches --row-h default

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    // infer columns from computed grid-template-columns
    const tmpl = cs.getPropertyValue('grid-template-columns');
    const count = tmpl ? tmpl.split(' ').filter(Boolean).length : DEFAULT_COLS;
    gridCols.current = count || DEFAULT_COLS;

    colW.current = el.clientWidth / gridCols.current;

    const rh = parseFloat(cs.getPropertyValue('--row-h')) || 8;
    rowH.current = rh;
  });

  // --- debounced PATCH -------------------------------------------------------
  const pending = React.useRef<WidgetState[] | null>(null);
  const debTimer = React.useRef<number | null>(null);
  const doPatch = React.useCallback(async (batch: Partial<WidgetState>[]) => {
    try {
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
    debTimer.current = window.setTimeout(() => {
      doPatch(updates);
      debTimer.current = null;
    }, 600);
  }

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
  const resizeStart = React.useRef<{ x: number; y: number; size: { w: number; h: number } } | null>(null);

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
          const ns = clampSize((rs.size?.w ?? w.size.w) + dCols, (rs.size?.h ?? w.size.h) + dRows);
          return { ...w, size: ns };
        }));
      }
    }
    function onUp() {
      if (dragId.current) {
        const id = dragId.current;
        dragId.current = null;
        const w = widgets.find(x => x.id === id);
        if (w) queuePatch([{ id: w.id, pos: w.pos }]);
      }
      if (resizeId.current) {
        const id = resizeId.current;
        resizeId.current = null;
        const w = widgets.find(x => x.id === id);
        if (w) queuePatch([{ id: w.id, size: w.size }]);
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
    if (!guideOpen) return;
    // ignore drags from control area
    const t = e.target as HTMLElement;
    if (t.closest('.wframe-controls')) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragId.current = w.id;
    dragStart.current = { x: e.clientX, y: e.clientY, pos: { ...w.pos } };
  }

  function startResize(e: React.PointerEvent, w: WidgetState) {
    if (!guideOpen) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    resizeId.current = w.id;
    resizeStart.current = { x: e.clientX, y: e.clientY, size: { ...w.size } };
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

  return (
    <div ref={containerRef} className="section-grid mxtk-grid" data-grid role="list">
      {widgets.map((w) => {
        // Force spans: match your CSS (grid uses var(--row-h))
        const spanW = Math.max(1, w.size?.w ?? 3);
        const spanH = Math.max(1, w.size?.h ?? 12);

        return (
          <div
            key={w.id}
            role="listitem"
            tabIndex={0}
            className="widget-tile wframe widget-cell"
            style={{
              gridColumn: `span ${spanW}`,
              gridRow: `span ${spanH}`,
            }}
            data-widget-id={w.id}
            onKeyDown={(e) => onKey(e, w)}
          >
            {/* drag surface */}
            <div
              className="widget-chrome"
              onPointerDown={(e) => startDrag(e, w)}
            >
              {/* widget header/actions are inside the child WidgetFrame (your file) */}
              <div className="widget-body">
                {render ? render(w) : (
                  <div className="p-3 text-sm opacity-70">Widget <code>{w.type}</code></div>
                )}
              </div>
            </div>

            {/* resizer handle (bottom-right) - only show when Sherpa is open */}
            {guideOpen && (
              <button
                type="button"
                className="wframe-resize"
                aria-label="Resize widget"
                onPointerDown={(e) => startResize(e, w)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}