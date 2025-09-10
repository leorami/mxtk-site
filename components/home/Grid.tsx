"use client";
import { clampToGrid, resolveCollisions } from "@/lib/home/pureStore";
import type { HomeDoc, WidgetState } from "@/lib/home/types";
import * as React from "react";

type GridProps = {
  doc: HomeDoc;
  sectionId: string;
  onChange?: (widgets: WidgetState[]) => void; // debounced in parent
};

export default function Grid({ doc, sectionId, onChange }: GridProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [widgets, setWidgets] = React.useState<WidgetState[]>(
    doc.widgets
      .filter(w => w.sectionId === sectionId)
      .map(w => ({
        ...w,
        size: { w: Math.max(w.size?.w ?? 3, 3), h: Math.max(w.size?.h ?? 4, 4) },
      }))
  );

  React.useEffect(() => { onChange?.(widgets); /* eslint-disable-next-line */ }, [JSON.stringify(widgets)]);

  const activeRef = React.useRef<{
    id: string; kind: "move"|"resize";
    startX: number; startY: number; startW: number; startH: number; startCol: number; startRow: number
  }|null>(null);

  function colsForViewport() {
    if (typeof window === "undefined") return 12;
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w < 1024) return 6;
    return 12;
  }
  const colCount = colsForViewport();

  function toCellDelta(dx: number, dy: number) {
    const root = containerRef.current!;
    const style = getComputedStyle(root);
    const gapX = parseFloat(style.columnGap || "0");
    const gapY = parseFloat(style.rowGap || "0");
    const colW = root.clientWidth / colCount - gapX;
    const rowH = parseFloat(getComputedStyle(root).getPropertyValue("--row-h")) || 12;
    return { dCols: Math.round(dx / (colW + gapX)), dRows: Math.round(dy / (rowH + gapY)) };
  }

  function startMove(e: React.PointerEvent, w: WidgetState) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    activeRef.current = { id: w.id, kind: "move", startX: e.clientX, startY: e.clientY, startW: w.size.w, startH: w.size.h, startCol: w.pos.x, startRow: w.pos.y };
  }
  function startResize(e: React.PointerEvent, w: WidgetState) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    activeRef.current = { id: w.id, kind: "resize", startX: e.clientX, startY: e.clientY, startW: w.size.w, startH: w.size.h, startCol: w.pos.x, startRow: w.pos.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!activeRef.current) return;
    const a = activeRef.current;
    const { dCols, dRows } = toCellDelta(e.clientX - a.startX, e.clientY - a.startY);
    setWidgets(prev => {
      const i = prev.findIndex(w => w.id === a.id);
      if (i < 0) return prev;
      const next = [...prev];
      const w = { ...next[i] };
      if (a.kind === "move") {
        const result = clampToGrid({ x: a.startCol + dCols, y: a.startRow + dRows }, w.size, colCount);
        w.pos = result.pos;
      } else {
        const result = clampToGrid(w.pos, { w: Math.max(3, a.startW + dCols), h: Math.max(4, a.startH + dRows) }, colCount);
        w.size = result.size;
      }
      next[i] = w;
      return resolveCollisions(next, colCount) as WidgetState[];
    });
  }
  function onPointerUp() { activeRef.current = null; }

  function onKeyDown(e: React.KeyboardEvent, id: string) {
    const move = (dx: number, dy: number) => {
      setWidgets(prev => resolveCollisions(prev.map(w => w.id !== id ? w : {
        ...w, 
        pos: clampToGrid({ x: w.pos.x + dx, y: w.pos.y + dy }, w.size, colCount).pos
      }), colCount) as WidgetState[]);
    };
    const resize = (dw: number, dh: number) => {
      setWidgets(prev => resolveCollisions(prev.map(w => w.id !== id ? w : {
        ...w, 
        size: clampToGrid(w.pos, { w: Math.max(3, w.size.w + dw), h: Math.max(4, w.size.h + dh) }, colCount).size
      }), colCount) as WidgetState[]);
    };
    if (e.shiftKey) {
      if (e.key === "ArrowRight") { e.preventDefault(); resize(1,0); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); resize(-1,0); }
      if (e.key === "ArrowDown")  { e.preventDefault(); resize(0,1); }
      if (e.key === "ArrowUp")    { e.preventDefault(); resize(0,-1); }
    } else {
      if (e.key === "ArrowRight") { e.preventDefault(); move(1,0); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); move(-1,0); }
      if (e.key === "ArrowDown")  { e.preventDefault(); move(0,1); }
      if (e.key === "ArrowUp")    { e.preventDefault(); move(0,-1); }
    }
  }

  return (
    <div
      ref={containerRef}
      className="grid-rail"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ ["--cols" as any]: colCount, ["--row-h" as any]: "12px" }}
    >
      {widgets.map(w => (
        <div
          key={w.id}
          className="wframe"
          style={{ gridColumn: `${w.pos.x + 1} / span ${w.size.w}`, gridRow: `${w.pos.y + 1} / span ${w.size.h}` }}
          onPointerDown={(e) => startMove(e, w)}
          onKeyDown={(e) => onKeyDown(e, w.id)}
          role="group" aria-label={`${w.title ?? w.type} widget`} tabIndex={0}
          data-widget-id={w.id} data-testid="wframe"
        >
          <div className="wframe-controls" aria-hidden="true">
            <button className="iconbtn" title="Refresh">↻</button>
            <button className="iconbtn" title="Settings">⚙︎</button>
            <button className="iconbtn" title="Pin">📌</button>
          </div>
          <div className="wframe-body" data-widget-body />
          <div className="wframe-resize" onPointerDown={(e) => { e.stopPropagation(); startResize(e, w); }} aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}