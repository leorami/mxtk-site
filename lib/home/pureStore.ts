import type { HomeDoc, Pos, Size, WidgetId, WidgetState, WidgetType } from '@/lib/home/gridTypes';
import { GRID_COLS, getMinSizeForWidget } from '@/lib/home/gridTypes';

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function rectsOverlap(a: { pos: Pos; size: Size }, b: { pos: Pos; size: Size }): boolean {
  return (
    a.pos.x < b.pos.x + b.size.w &&
    a.pos.x + a.size.w > b.pos.x &&
    a.pos.y < b.pos.y + b.size.h &&
    a.pos.y + a.size.h > b.pos.y
  );
}

export function clampToGrid(pos: Pos, size: Size, gridCols: number = GRID_COLS): Pos {
  const maxX = Math.max(0, gridCols - size.w);
  const x = Math.min(Math.max(0, pos.x), maxX);
  const y = Math.max(0, pos.y);
  return { x, y };
}

export function nextNonOverlappingPos(widgets: WidgetState[], size: Size, gridCols: number = GRID_COLS): Pos {
  // Simple skyline scan: increase y row-by-row, scan x from 0..gridCols-size.w
  const maxX = Math.max(0, gridCols - size.w);
  let y = 0;
  // Cap to a reasonable search space to avoid infinite loops in degenerate cases
  const MAX_ROWS = 10_000;
  for (let guard = 0; guard < MAX_ROWS; guard++) {
    for (let x = 0; x <= maxX; x++) {
      const candidate: { pos: Pos; size: Size } = { pos: { x, y }, size };
      const overlaps = widgets.some(w => rectsOverlap(candidate, { pos: w.pos, size: w.size }));
      if (!overlaps) {
        return { x, y };
      }
    }
    y += 1;
  }
  // Fallback to (0, y) after scan cap
  return { x: 0, y };
}

function withTimestamps(w: WidgetState, existing?: WidgetState): WidgetState {
  const now = new Date().toISOString();
  return existing
    ? { ...w, createdAt: existing.createdAt || now, updatedAt: now }
    : { ...w, createdAt: now, updatedAt: now };
}

export function addWidget(doc: HomeDoc, partial: Omit<WidgetState, 'id' | 'pos'> & { id?: WidgetId; pos?: Pos }): HomeDoc {
  const base = deepClone(doc);
  const id: WidgetId = partial.id || (globalThis.crypto?.randomUUID?.() ?? `w_${Math.random().toString(36).slice(2)}`);
  const size: Size = deepClone(partial.size);
  const pos: Pos = partial.pos ? clampToGrid(partial.pos, size) : nextNonOverlappingPos(base.widgets, size);
  const ws: WidgetState = withTimestamps({
    id,
    type: partial.type as WidgetType,
    title: partial.title,
    size,
    pos,
    pinned: !!partial.pinned,
    data: partial.data ? deepClone(partial.data) : undefined,
  });
  const next: HomeDoc = { id: base.id, widgets: [...base.widgets, ws], layoutVersion: 1 };
  return next;
}

export function moveWidget(doc: HomeDoc, id: WidgetId, to: Pos, gridCols: number = GRID_COLS): HomeDoc {
  const base = deepClone(doc);
  const idx = base.widgets.findIndex(w => w.id === id);
  if (idx < 0) return base;
  const target = base.widgets[idx];
  const size = target.size;
  let pos = clampToGrid(to, size, gridCols);
  // Check overlap; if overlapping, find next available from desired row
  const others = base.widgets.filter((_, i) => i !== idx);
  if (others.some(w => rectsOverlap({ pos, size }, { pos: w.pos, size: w.size }))) {
    pos = nextNonOverlappingPos(others, size, gridCols);
  }
  const updated: WidgetState = withTimestamps({ ...target, pos }, target);
  const widgets = base.widgets.slice();
  widgets[idx] = updated;
  return { id: base.id, widgets, layoutVersion: 1 };
}

export function resizeWidget(doc: HomeDoc, id: WidgetId, size: Size, gridCols: number = GRID_COLS): HomeDoc {
  const base = deepClone(doc);
  const idx = base.widgets.findIndex(w => w.id === id);
  if (idx < 0) return base;
  const target = base.widgets[idx];
  const min = getMinSizeForWidget(target.type);
  const clampedSize: Size = {
    w: Math.max(1, min ? Math.max(min.w, size.w) : size.w),
    h: Math.max(1, min ? Math.max(min.h, size.h) : size.h),
  };
  const pos = clampToGrid(target.pos, clampedSize, gridCols);
  const proposal = { pos, size: clampedSize };
  const others = base.widgets.filter((_, i) => i !== idx);
  let finalPos = pos;
  if (others.some(w => rectsOverlap(proposal, { pos: w.pos, size: w.size }))) {
    finalPos = nextNonOverlappingPos(others, clampedSize, gridCols);
  }
  const updated: WidgetState = withTimestamps({ ...target, pos: finalPos, size: clampedSize }, target);
  const widgets = base.widgets.slice();
  widgets[idx] = updated;
  return { id: base.id, widgets, layoutVersion: 1 };
}

export function removeWidget(doc: HomeDoc, id: WidgetId): HomeDoc {
  const base = deepClone(doc);
  const widgets = base.widgets.filter(w => w.id !== id);
  return { id: base.id, widgets, layoutVersion: 1 };
}

export function pinWidget(doc: HomeDoc, id: WidgetId): HomeDoc {
  const base = deepClone(doc);
  const idx = base.widgets.findIndex(w => w.id === id);
  if (idx < 0) return base;
  const target = base.widgets[idx];
  const updated: WidgetState = withTimestamps({ ...target, pinned: !target.pinned }, target);
  const widgets = base.widgets.slice();
  widgets[idx] = updated;
  return { id: base.id, widgets, layoutVersion: 1 };
}

export function togglePinWidget(doc: HomeDoc, id: WidgetId): HomeDoc {
  return pinWidget(doc, id);
}

export function upsertWidgetData(doc: HomeDoc, id: WidgetId, data: Record<string, unknown>): HomeDoc {
  const base = deepClone(doc);
  const idx = base.widgets.findIndex(w => w.id === id);
  if (idx < 0) return base;
  const target = base.widgets[idx];
  const merged = { ...(target.data || {}), ...deepClone(data) };
  const updated: WidgetState = withTimestamps({ ...target, data: merged }, target);
  const widgets = base.widgets.slice();
  widgets[idx] = updated;
  return { id: base.id, widgets, layoutVersion: 1 };
}

export function serialize(doc: HomeDoc): string {
  return JSON.stringify(doc, null, 2);
}

export function deserialize(input: string): HomeDoc {
  const raw = JSON.parse(input);
  const id = String(raw.id || 'home');
  const widgets: WidgetState[] = Array.isArray(raw.widgets) ? raw.widgets.map((w: any) => ({
    id: String(w.id),
    type: w.type as WidgetType,
    title: w.title ? String(w.title) : undefined,
    size: { w: Number(w.size?.w || 4), h: Number(w.size?.h || 3) },
    pos: { x: Number(w.pos?.x || 0), y: Number(w.pos?.y || 0) },
    pinned: Boolean(w.pinned),
    data: w.data && typeof w.data === 'object' ? w.data : undefined,
    createdAt: w.createdAt ? String(w.createdAt) : undefined,
    updatedAt: w.updatedAt ? String(w.updatedAt) : undefined,
  })) : [];
  return { id, widgets, layoutVersion: 1 };
}


