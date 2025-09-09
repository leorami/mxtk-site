"use client";

import {
  clampToGrid,
  resolveCollisions,
  type GridRect,
  type Item,
} from "@/lib/home/pureStore";
import type { CSSProperties } from "react";
import * as React from "react";

const ROW_H = 24;       // px per row (match your token)
const GAP_Y = 8;        // vertical gap between grid rows

// Measure each widget's content and update its 'h' (rows) automatically.
function useAutoHeights(refs: React.MutableRefObject<Record<string, HTMLElement | null>>, setWidgets: React.Dispatch<React.SetStateAction<WidgetLike[]>>) {
  React.useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      setWidgets(prev => {
        let changed = false;
        const widgets = prev.map(w => {
          const el = refs.current[w.id];
          if (!el) return w;
          const content = el.querySelector('[data-widget-body]') as HTMLElement | null;
          if (!content) return w;
          
          // Calculate required height more accurately
          const headerHeight = 60; // header + padding
          const contentHeight = content.scrollHeight;
          const totalHeight = headerHeight + contentHeight;
          const rows = Math.max(3, Math.ceil(totalHeight / (ROW_H + GAP_Y)));
          
          if (rows !== w.size.h) {
            changed = true;
            return { ...w, size: { ...w.size, h: rows } };
          }
          return w;
        });
        return changed ? widgets : prev;
      });
    });
    Object.values(refs.current).forEach(el => el && ro.observe(el));
    return () => ro.disconnect();
  }, [refs, setWidgets]);
}

/**
 * Minimal types that match your Home doc widgets.
 */
export interface WidgetLike extends Item { }
export interface HomeDocLike {
  id: string;
  widgets: WidgetLike[];
}

type Props = {
  doc: HomeDocLike;
  sectionId?: string;             // render only this section if provided
  colsDesktop?: number;           // default 12
  colsTablet?: number;            // default 6
  colsMobile?: number;            // default 1
  gap?: number;                   // px gap (default 16)
  rowHeight?: number;             // px per row (default 24)
  onChange?: (widgets: WidgetLike[]) => void; // optional callback
  children?: (widget: WidgetLike) => React.ReactNode; // render prop for widget content
};

/**
 * A11y & inputs:
 * - Drag to move by grabbing the title area, drag handle, or empty body.
 * - Resize from the bottom-right corner handle.
 * - Keyboard: focus a card, Arrow keys move by 1; Shift+Arrow resizes by 1.
 * - aria-live region announces updated position/size.
 *
 * Persistence:
 * - Debounced PATCH to ./api/ai/home/[id] with { widgets:[{id,pos,size}] }.
 */
export default function Grid({
  doc,
  sectionId,
  colsDesktop = 12,
  colsTablet = 6,
  colsMobile = 1,
  gap = 16,
  rowHeight = 24,
  onChange,
  children,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const nodeRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const [cols, setCols] = React.useState(colsDesktop);
  const [containerW, setContainerW] = React.useState(1);
  const [sherpaOpen, setSherpaOpen] = React.useState(false);
  const [widgets, setWidgets] = React.useState<WidgetLike[]>(
    sectionId ? doc.widgets.filter(w => w.sectionId === sectionId) : doc.widgets
  );
  const [active, setActive] = React.useState<{
    id: string;
    mode: "move" | "resize";
    startPx: { x: number; y: number };
    startRect: GridRect;
  } | null>(null);
  const liveRegionRef = React.useRef<HTMLDivElement | null>(null);

  // Track Sherpa drawer state
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const updateSherpaState = () => {
      setSherpaOpen(document.documentElement.classList.contains('guide-open'));
    };
    
    updateSherpaState();
    const observer = new MutationObserver(updateSherpaState);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Auto-height widgets
  useAutoHeights(nodeRefs, setWidgets);

  // Responsive columns + ResizeObserver (client-only)
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const decideCols = () => {
      const w = el.clientWidth;
      setContainerW(w);
      if (w < 640) setCols(colsMobile);
      else if (w < 1024) setCols(colsTablet);
      else setCols(colsDesktop);
    };
    decideCols();

    const ro = new ResizeObserver(decideCols);
    ro.observe(el);
    return () => ro.disconnect();
  }, [colsDesktop, colsTablet, colsMobile]);

  // Debounced persistence
  const saveRef = React.useRef<number | null>(null);
  const persist = React.useCallback((current: WidgetLike[]) => {
    if (saveRef.current) window.clearTimeout(saveRef.current);
    saveRef.current = window.setTimeout(async () => {
      const body = {
        widgets: current.map(w => ({ id: w.id, pos: w.pos, size: w.size })),
      };
      try {
        await fetch(`./api/ai/home/${doc.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch {
        // best effort; silent fail
      }
    }, 600); // 600ms debounce
  }, [doc.id]);

  // External change callback
  const emitChange = React.useCallback((next: WidgetLike[]) => {
    onChange?.(next);
  }, [onChange]);

  // Helpers (px → grid)
  const colW = React.useMemo(() => {
    // cols columns and (cols - 1) gaps inside container width
    return (containerW - gap * (cols - 1)) / cols;
  }, [containerW, cols, gap]);

  const pxToGrid = React.useCallback((dx: number, dy: number) => {
    const gx = Math.round(dx / (colW + 0)); // cell width, gaps are between items
    const gy = Math.round(dy / (rowHeight + 0));
    return { gx, gy };
  }, [colW, rowHeight]);

  // Pointer handlers
  const onPointerDown = (e: React.PointerEvent, id: string, mode: "move" | "resize") => {
    const w = widgets.find(x => x.id === id);
    if (!w) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setActive({
      id,
      mode,
      startPx: { x: e.clientX, y: e.clientY },
      startRect: { ...w.pos, ...w.size },
    });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!active) return;
    const { gx, gy } = pxToGrid(e.clientX - active.startPx.x, e.clientY - active.startPx.y);

    setWidgets(prev => {
      const idx = prev.findIndex(x => x.id === active.id);
      if (idx < 0) return prev;

      const draft = prev.map(x => ({ ...x, pos: { ...x.pos }, size: { ...x.size } }));
      const target = draft[idx];

      if (active.mode === "move") {
        const nextRect = clampToGrid(
          { x: active.startRect.x + gx, y: active.startRect.y + gy, w: active.startRect.w, h: active.startRect.h },
          cols
        );
        target.pos = { x: nextRect.x, y: nextRect.y };
      } else {
        const nextRect = clampToGrid(
          { x: target.pos.x, y: target.pos.y, w: Math.max(1, active.startRect.w + gx), h: Math.max(1, active.startRect.h + gy) },
          cols
        );
        target.size = { w: nextRect.w, h: nextRect.h };
      }

      const resolved = resolveCollisions(draft, cols);
      announce(resolved[idx]);
      return resolved;
    });
  };

  const onPointerUp = () => {
    if (!active) return;
    setActive(null);
    persist(widgets);
    emitChange(widgets);
  };

  // Keyboard
  const onKeyDown = (e: React.KeyboardEvent, id: string) => {
    const delta = (shift = false) => (shift ? "resize" : "move");
    const isArrow = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key);
    if (!isArrow) return;

    e.preventDefault();
    const mode = delta(e.shiftKey);

    setWidgets(prev => {
      const draft = prev.map(x => ({ ...x, pos: { ...x.pos }, size: { ...x.size } }));
      const i = draft.findIndex(x => x.id === id);
      if (i < 0) return prev;
      const t = draft[i];

      if (mode === "move") {
        if (e.key === "ArrowLeft") t.pos.x -= 1;
        if (e.key === "ArrowRight") t.pos.x += 1;
        if (e.key === "ArrowUp") t.pos.y -= 1;
        if (e.key === "ArrowDown") t.pos.y += 1;
        const c = clampToGrid({ ...t.pos, ...t.size }, cols);
        t.pos = { x: c.x, y: c.y };
      } else {
        if (e.key === "ArrowLeft") t.size.w -= 1;
        if (e.key === "ArrowRight") t.size.w += 1;
        if (e.key === "ArrowUp") t.size.h -= 1;
        if (e.key === "ArrowDown") t.size.h += 1;
        const c = clampToGrid({ ...t.pos, ...t.size }, cols);
        t.size = { w: c.w, h: c.h };
      }

      const resolved = resolveCollisions(draft, cols);
      announce(resolved[i]);
      persist(resolved);
      emitChange(resolved);
      return resolved;
    });
  };

  const announce = (w: WidgetLike) => {
    const el = liveRegionRef.current;
    if (!el) return;
    el.textContent = `Widget updated. Column ${w.pos.x + 1} of ${cols}, row ${w.pos.y + 1}, width ${w.size.w}, height ${w.size.h}.`;
  };

  // Calculate minimum grid height to accommodate all widgets
  const minGridHeight = React.useMemo(() => {
    if (widgets.length === 0) return 200; // Default minimum height
    const maxBottomRow = Math.max(...widgets.map(w => w.pos.y + w.size.h));
    return maxBottomRow * (rowHeight + gap) + gap;
  }, [widgets, rowHeight, gap]);

  // Render
  const styleVars: CSSProperties = {
    "--grid-cols": String(cols),
    "--grid-gap": `${gap}px`,
    "--row-h": `${rowHeight}px`,
    minHeight: `${minGridHeight}px`,
  } as CSSProperties;

  return (
    <div className="home-grid" ref={containerRef} style={styleVars}>
      <div className="home-grid__inner" role="grid" aria-label="Dashboard widgets">
        {widgets.map((w) => {
          const style: CSSProperties = {
            gridColumn: `${w.pos.x + 1} / span ${w.size.w}`,
            gridRow: `${w.pos.y + 1} / span ${w.size.h}`,
          };
          return (
            <section
              key={w.id}
              ref={el => { nodeRefs.current[w.id] = el }}
              className="wframe"
              style={style}
              role="gridcell"
              tabIndex={0}
              aria-label={`Widget ${w.id}`}
              onKeyDown={(e) => onKeyDown(e, w.id)}
            >
              {sherpaOpen && (
                <div
                  className="wframe__drag"
                  title="Drag to move"
                  onPointerDown={(e) => onPointerDown(e, w.id, "move")}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                />
              )}
              {/* Content placeholder – your existing widget body renders here */}
              <div className="wframe__body" style={{ pointerEvents: 'auto' }}>
                {children ? children(w) : null}
              </div>
              {sherpaOpen && (
                <div
                  className="wframe__resize"
                  title="Drag to resize"
                  onPointerDown={(e) => onPointerDown(e, w.id, "resize")}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  aria-hidden="true"
                />
              )}
            </section>
          );
        })}
      </div>

      {/* a11y announcements */}
      <div
        ref={liveRegionRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      <style jsx global>{`
        .home-grid {
          position: relative;
        }
        .home-grid__inner {
          display: grid;
          grid-template-columns: repeat(var(--grid-cols), minmax(0, 1fr));
          grid-auto-rows: var(--row-h);
          gap: var(--grid-gap);
        }
        .wframe {
          position: relative;
          outline: none;
        }
        .wframe:focus-visible {
          box-shadow: 0 0 0 2px rgba(255, 185, 64, 0.9);
          border-radius: 12px;
        }
        .wframe__drag {
          position: absolute;
          inset: 0;
          cursor: grab;
          border-radius: 12px;
        }
        .wframe__drag:active {
          cursor: grabbing;
        }
        .wframe__body {
          position: relative;
          z-index: 1; /* ensures body remains interactive above drag layer where needed */
          pointer-events: none; /* keep the whole card draggable; enable inner controls as you wire widgets */
        }
        .wframe__resize {
          position: absolute;
          right: 6px;
          bottom: 6px;
          width: 14px;
          height: 14px;
          border-radius: 4px;
          cursor: nwse-resize;
          background: radial-gradient(closest-side, rgba(0,0,0,0.25), transparent);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
}