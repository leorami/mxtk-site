// lib/home/pureStore.ts
import { GRID_COLS, type HomeDoc, type Pos as WidgetPos, type Size as WidgetSize, type WidgetState } from '@/lib/home/gridTypes';
export type Id = string;

export interface GridPos { x: number; y: number }
export interface GridSize { w: number; h: number }
export interface GridRect { x: number; y: number; w: number; h: number }
export interface Item {
  id: Id;
  sectionId?: string;
  pos: GridPos;
  size: GridSize;
}

export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export function rectsOverlap(a: GridRect, b: GridRect) {
  return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
}

/**
 * Keep within grid bounds.
 */
function clampToGridParts(pos: GridPos, size: GridSize, cols: number, maxRows = 10_000): { pos: GridPos; size: GridSize } {
  const w = clamp(size.w, 1, cols);
  const h = clamp(size.h, 1, maxRows);
  const x = clamp(pos.x, 0, cols - w);
  const y = clamp(pos.y, 0, maxRows - h);
  return { pos: { x, y }, size: { w, h } };
}

// Test-facing helper: clamps rect and returns flattened object
export function clampToGrid(rect: { x: number; y: number; w: number; h: number }, cols: number, maxRows = 10_000): { x: number; y: number; w: number; h: number } {
  const clamped = clampToGridParts({ x: rect.x, y: rect.y }, { w: rect.w, h: rect.h }, cols, maxRows)
  return { x: clamped.pos.x, y: clamped.pos.y, w: clamped.size.w, h: clamped.size.h }
}

/**
 * Greedy push-down collision resolver. Mutates a shallow copy and returns it.
 * Items are treated in increasing Y, then X order so upper/left items have priority.
 */
export function resolveCollisions(items: Item[], cols: number): Item[] {
  const out = items.map(i => ({ ...i, pos: { ...i.pos }, size: { ...i.size } }));
  // sort by y, then x for stable resolution
  out.sort((a, b) => (a.pos.y - b.pos.y) || (a.pos.x - b.pos.x));

  for (let i = 0; i < out.length; i++) {
    const a = out[i];
    let moved = true;
    while (moved) {
      moved = false;
      for (let j = 0; j < out.length; j++) {
        if (i === j) continue;
        const b = out[j];
        if (rectsOverlap({ ...a.pos, ...a.size }, { ...b.pos, ...b.size })) {
          // push B down one row
          b.pos.y = a.pos.y + a.size.h;
          const clamped = clampToGridParts(b.pos, b.size, cols);
          b.pos = clamped.pos;
          moved = true;
        }
      }
    }
    const clamped = clampToGridParts(a.pos, a.size, cols);
    a.pos = clamped.pos;
  }
  // restore original order
  out.sort((a, b) => items.findIndex(x => x.id === a.id) - items.findIndex(x => x.id === b.id));
  return out;
}

/**
 * Find the next Y below all collisions for a rect among given items.
 */
export function nextNonOverlappingPos(target: GridRect, items: Item[]): GridPos {
  let y = target.y;
  // climb down until no overlaps
  // guard against infinite loops with sane max
  for (let guard = 0; guard < 50_000; guard++) {
    if (items.every(it => !rectsOverlap({ ...target, y }, { ...it.pos, ...it.size }))) {
      return { x: target.x, y };
    }
    y += 1;
  }
  return { x: target.x, y }; // fallback
}

// -------- High-level HomeDoc reducers expected by tests --------

let __idCounter = 0
function genId(): string { __idCounter = (__idCounter + 1) % 1_000_000; return `${Date.now().toString(36)}_${__idCounter.toString(36)}` }

function placeNewWidget(existing: WidgetState[], desired: { w: number; h: number }): WidgetPos {
  // Try positions scanning rows left-to-right, top-to-bottom
  for (let y = 0; y < 10_000; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      const pos: WidgetPos = { x, y }
      const overlap = existing.some(w => rectsOverlap({ ...w.pos, ...w.size }, { ...pos, ...desired }))
      if (!overlap) {
        const clamped = clampToGridParts(pos, desired, GRID_COLS)
        return clamped.pos
      }
    }
  }
  return { x: 0, y: 0 }
}

export function addWidget(doc: HomeDoc, payload: { type: WidgetState['type']; title?: string; size: WidgetSize; sectionId?: string }): HomeDoc {
  const base = { ...doc, widgets: [...doc.widgets] }
  const size: WidgetSize = { w: Math.max(1, payload.size.w), h: Math.max(1, payload.size.h) }
  // Auto-place within the target section (default to first section)
  const sectionId = (payload.sectionId as any) || (doc.sections?.[0]?.id || 'overview')
  const inSection = (base.widgets as any as WidgetState[]).filter(w => (w.sectionId || (doc.sections?.[0]?.id || 'overview')) === sectionId)
  const pos = placeNewWidget(inSection as any, size)
  const w: WidgetState = { id: genId(), type: payload.type as any, title: payload.title, sectionId: sectionId as any, size, pos }
  base.widgets.push(w)
  return base
}

export function moveWidget(doc: HomeDoc, id: string, to: WidgetPos): HomeDoc {
  const widgets = doc.widgets.map(w => ({ ...w }))
  const idx = widgets.findIndex(w => w.id === id)
  if (idx === -1) return doc
  const cur = widgets[idx]
  // clamp position against current size, do not change size
  const clamped = clampToGridParts(to as any, cur.size as any, GRID_COLS)
  widgets[idx] = { ...cur, pos: clamped.pos }
  // push others down to avoid overlap
  const items: Item[] = widgets.map(w => ({ id: w.id, pos: w.pos as any, size: w.size as any }))
  const resolved = resolveCollisions(items, GRID_COLS)
  for (const r of resolved) {
    const j = widgets.findIndex(w => w.id === r.id)
    if (j >= 0) widgets[j] = { ...widgets[j], pos: r.pos as any, size: r.size as any }
  }
  return { ...doc, widgets }
}

export function resizeWidget(doc: HomeDoc, id: string, next: WidgetSize): HomeDoc {
  const widgets = doc.widgets.map(w => ({ ...w }))
  const idx = widgets.findIndex(w => w.id === id)
  if (idx === -1) return doc
  const cur = widgets[idx]
  // Allow width beyond GRID_COLS; only clamp position
  const size: WidgetSize = { w: Math.max(1, next.w), h: Math.max(1, next.h) }
  const pos = clampToGridParts(cur.pos as any, size as any, GRID_COLS).pos
  widgets[idx] = { ...cur, size, pos }
  // Resolve overlaps
  const items: Item[] = widgets.map(w => ({ id: w.id, pos: w.pos as any, size: w.size as any }))
  const resolved = resolveCollisions(items, GRID_COLS)
  for (const r of resolved) {
    const j = widgets.findIndex(w => w.id === r.id)
    if (j >= 0) widgets[j] = { ...widgets[j], pos: r.pos as any, size: r.size as any }
  }
  return { ...doc, widgets }
}

export function removeWidget(doc: HomeDoc, id: string): HomeDoc {
  return { ...doc, widgets: doc.widgets.filter(w => w.id !== id) }
}

export function pinWidget(doc: HomeDoc, id: string): HomeDoc {
  const widgets = doc.widgets.map(w => w.id === id ? { ...w, pinned: !w.pinned } : w)
  return { ...doc, widgets }
}

export function togglePinWidget(doc: HomeDoc, id: string): HomeDoc {
  const widgets = doc.widgets.map(w => w.id === id ? { ...w, pinned: !w.pinned } : w)
  return { ...doc, widgets }
}

export function ensureWidget(doc: HomeDoc, opts: { type: WidgetState['type']; sectionId?: string; title?: string; size?: WidgetSize; data?: Record<string, unknown> }): HomeDoc {
  const type = opts.type
  const sectionId = (opts.sectionId as any) || (doc.sections?.[0]?.id || 'overview')
  const idx = (doc.widgets || []).findIndex(w => w.type === type)
  if (idx >= 0) {
    const cur = doc.widgets[idx]
    const merged: WidgetState = {
      ...cur,
      title: opts.title ?? cur.title,
      sectionId: sectionId || cur.sectionId,
      data: opts.data ? { ...(cur.data || {}), ...opts.data } : cur.data,
      size: opts.size ? { ...cur.size, ...opts.size } : cur.size,
    } as WidgetState
    const widgets = [...doc.widgets]
    widgets[idx] = merged
    return { ...doc, widgets }
  }
  const size: WidgetSize = opts.size ? { w: Math.max(1, opts.size.w), h: Math.max(1, opts.size.h) } : { w: 4, h: 12 }
  // Auto-place within the same section to avoid overlap/occlusion
  const existingInSection = (doc.widgets as any as WidgetState[]).filter(w => (w.sectionId || (doc.sections?.[0]?.id || 'overview')) === sectionId)
  const pos = placeNewWidget(existingInSection as any, size)
  const next: WidgetState = {
    id: genId(),
    type,
    title: opts.title,
    sectionId,
    size,
    pos,
    data: opts.data as any,
  }
  return { ...doc, widgets: [...doc.widgets, next] }
}

export function upsertWidgetData(doc: HomeDoc, id: string, data: Record<string, unknown>): HomeDoc {
  const widgets = doc.widgets.map(w => w.id === id ? { ...w, data: { ...(w.data || {}), ...data } } : w)
  return { ...doc, widgets }
}

// Simple JSON serialize/deserialize for fileStore tests
export function serialize(doc: HomeDoc): string { return JSON.stringify(doc, null, 2) }
export function deserialize(txt: string): HomeDoc { return JSON.parse(txt) as HomeDoc }