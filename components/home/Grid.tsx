"use client";
import WidgetFrame from '@/components/home/WidgetFrame';
import { getApiPath } from '@/lib/basepath';
import type { HomeDoc, Pos, Size, WidgetState } from '@/lib/home/gridTypes';
import { moveWidget as rMove, resizeWidget as rResize } from '@/lib/home/pureStore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function Grid({ doc }: { doc: HomeDoc; onAction?: (action: string, w: WidgetState) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [widgets, setWidgets] = useState<WidgetState[]>(doc.widgets);
  const [homeId, setHomeId] = useState<string | null>(null);
  const [active, setActive] = useState<{ id: string; mode: 'move' | 'resize'; startPos: Pos; startSize?: Size; startMouse?: { x: number; y: number }; colWidth: number } | null>(null);

  useEffect(() => { setWidgets(doc.widgets); }, [doc.widgets]);
  useEffect(() => {
    try {
      const cookie = document.cookie.split('; ').find(x => x.startsWith('mxtk_home_id='));
      if (cookie) setHomeId(cookie.split('=')[1]);
    } catch { }
  }, []);

  const localDoc = useMemo<HomeDoc>(() => ({ id: doc.id, widgets, layoutVersion: 1 }), [doc.id, widgets]);

  const updateServer = useCallback(async (payload: any) => {
    if (!homeId) return;
    try {
      await fetch(getApiPath(`/api/ai/home/${encodeURIComponent(homeId)}`), {
        method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
      });
    } catch { }
  }, [homeId]);

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>, w: WidgetState) => {
    let dx = 0, dy = 0, dw = 0, dh = 0;
    if (e.key === 'ArrowLeft') dx = -1;
    if (e.key === 'ArrowRight') dx = 1;
    if (e.key === 'ArrowUp') dy = -1;
    if (e.key === 'ArrowDown') dy = 1;
    if (dx === 0 && dy === 0) return;
    e.preventDefault();
    if (e.shiftKey) {
      // resize
      dw = dx; dh = dy;
      const next = rResize(localDoc, w.id, { w: Math.max(1, w.size.w + dw), h: Math.max(1, w.size.h + dh) });
      setWidgets(next.widgets);
      updateServer({ widgetId: w.id, size: next.widgets.find(x => x.id === w.id)?.size });
    } else {
      // move
      const next = rMove(localDoc, w.id, { x: Math.max(0, w.pos.x + dx), y: Math.max(0, w.pos.y + dy) });
      setWidgets(next.widgets);
      updateServer({ widgetId: w.id, pos: next.widgets.find(x => x.id === w.id)?.pos });
    }
  };

  const onPointerDown = (e: React.PointerEvent, w: WidgetState, mode: 'move' | 'resize') => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const colWidth = rect.width / 12;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setActive({ id: w.id, mode, startPos: w.pos, startSize: w.size, startMouse: { x: e.clientX, y: e.clientY }, colWidth });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!active) return;
    const dxPx = (e.clientX - (active.startMouse?.x || 0));
    const dyPx = (e.clientY - (active.startMouse?.y || 0));
    const dxCols = Math.round(dxPx / active.colWidth);
    const dyRows = Math.round(dyPx / 24); // GRID_ROW_H
    if (active.mode === 'move') {
      const next = rMove(localDoc, active.id, { x: Math.max(0, active.startPos.x + dxCols), y: Math.max(0, active.startPos.y + dyRows) });
      setWidgets(next.widgets);
    } else {
      const next = rResize(localDoc, active.id, { w: Math.max(1, (active.startSize?.w || 1) + dxCols), h: Math.max(1, (active.startSize?.h || 1) + dyRows) });
      setWidgets(next.widgets);
    }
  };

  const onPointerUp = () => {
    if (!active) return;
    const w = localDoc.widgets.find(x => x.id === active.id);
    if (w) {
      if (active.mode === 'move') updateServer({ widgetId: w.id, pos: w.pos });
      else updateServer({ widgetId: w.id, size: w.size });
    }
    setActive(null);
  };

  const onActionClick = useCallback((action: 'pin-toggle' | 'remove', w: WidgetState) => {
    if (action === 'remove') {
      setWidgets(prev => prev.filter(x => x.id !== w.id));
      updateServer({ widgetId: w.id, remove: true });
    } else if (action === 'pin-toggle') {
      setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, pinned: !x.pinned } : x));
      updateServer({ widgetId: w.id, pin: true });
    }
  }, [updateServer]);

  return (
    <div
      ref={containerRef}
      data-testid="home-grid"
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Page title to match site styling */}
      <div className="col-span-12">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--ink-strong)] dark:text-[var(--ink-strong)] mb-2">Your Home</h1>
        <p className="text-sm text-[var(--ink-muted)] dark:text-[var(--ink-muted)] mb-2">Pin helpful widgets, drag to arrange, and resize as you learn. Use the buttons below or ask Sherpa for suggestions.</p>
      </div>
      {widgets.map(w => (
        <div
          key={w.id}
          data-widget-id={w.id}
          tabIndex={0}
          onKeyDown={(e) => onKey(e, w)}
          className="min-w-0 group relative"
          style={{
            gridColumn: `${w.pos.x + 1} / span ${w.size.w}`,
            gridRow: `auto / span ${w.size.h}`,
          }}
        >
          {/* Drag handle overlay */}
          <button
            type="button"
            aria-label="Drag"
            data-testid="drag-handle"
            className="absolute left-2 top-2 z-10 hidden sm:flex items-center justify-center w-6 h-6 rounded bg-white/70 text-slate-900 border border-black/10 group-hover:flex"
            onPointerDown={(e) => onPointerDown(e, w, 'move')}
          >
            ≡
          </button>
          {/* Resize handle */}
          <button
            type="button"
            aria-label="Resize"
            data-testid="resize-handle"
            className="absolute right-1 bottom-1 z-10 flex items-center justify-center w-5 h-5 rounded bg-white/70 text-slate-900 border border-black/10"
            onPointerDown={(e) => onPointerDown(e, w, 'resize')}
          >
            ⤡
          </button>
          <WidgetFrame widget={w} onAction={(a) => a === 'remove' || a === 'pin-toggle' ? onActionClick(a as any, w) : undefined} />
        </div>
      ))}
      {widgets.length === 0 && (
        <div className="col-span-12 rounded-2xl border p-6 text-center text-sm bg-[var(--surface-card)]/60 backdrop-blur">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="opacity-80">Your Home is empty. Add a starter widget or ask Sherpa to help.</div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                className="px-3 py-1.5 rounded-lg border border-[var(--border-soft)] bg-white text-slate-900 hover:bg-gray-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                onClick={async () => {
                  try {
                    const res = await fetch(getApiPath('/api/ai/home/add'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widget: { type: 'recent-answers', title: 'Recent Answers' } }) });
                    const j = await res.json(); if (j?.ok && j?.widget) { setWidgets([...(doc.widgets || []), j.widget]); }
                  } catch { }
                }}
              >Recent Answers</button>
              <button
                className="px-3 py-1.5 rounded-lg border border-[var(--border-soft)] bg-white text-slate-900 hover:bg-gray-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                onClick={async () => {
                  try {
                    const res = await fetch(getApiPath('/api/ai/home/add'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widget: { type: 'glossary-spotlight', title: 'Glossary Spotlight' } }) });
                    const j = await res.json(); if (j?.ok && j?.widget) { setWidgets([...(doc.widgets || []), j.widget]); }
                  } catch { }
                }}
              >Glossary</button>
              <button
                className="px-3 py-1.5 rounded-lg border border-[var(--border-soft)] bg-white text-slate-900 hover:bg-gray-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                onClick={async () => {
                  try {
                    const res = await fetch(getApiPath('/api/ai/home/add'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widget: { type: 'resource-list', title: 'Resources' } }) });
                    const j = await res.json(); if (j?.ok && j?.widget) { setWidgets([...(doc.widgets || []), j.widget]); }
                  } catch { }
                }}
              >Resources</button>
              <button
                className="px-3 py-1.5 rounded-lg border border-[var(--border-soft)] bg-white text-slate-900 hover:bg-gray-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                onClick={async () => {
                  try {
                    const res = await fetch(getApiPath('/api/ai/home/add'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widget: { type: 'custom-note', title: 'Note' } }) });
                    const j = await res.json(); if (j?.ok && j?.widget) { setWidgets([...(doc.widgets || []), j.widget]); }
                  } catch { }
                }}
              >Custom Note</button>
              <button
                className="px-3 py-1.5 rounded-lg border border-[var(--border-soft)] bg-[var(--mxtk-orange)] text-white hover:bg-[color-mix(in_srgb,var(--mxtk-orange)_88%,black)]"
                onClick={() => { try { window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: { prompt: 'Add a helpful widget to my Home and explain how to use it.' } })); } catch { } }}
              >Ask Sherpa</button>
            </div>
            <div className="text-xs opacity-70">Tip: pick your experience level in the top bar. Your Home adapts as you learn.</div>
          </div>
        </div>
      )}
      <style jsx>{`
        @media (max-width: 1024px) { div[data-testid="home-grid"]{ grid-template-columns: repeat(6, minmax(0, 1fr)); } }
        @media (max-width: 640px)  { div[data-testid="home-grid"]{ grid-template-columns: repeat(1, minmax(0, 1fr)); } }
      `}</style>
    </div>
  );
}


