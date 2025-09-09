// lib/home/pureStore.ts
export type Id = string;

export interface GridPos { x: number; y: number }
export interface GridSize { w: number; h: number }
export interface GridRect extends GridPos, GridSize { }
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
export function clampToGrid(r: GridRect, cols: number, maxRows = 10_000): GridRect {
  const w = clamp(r.w, 1, cols);
  const h = clamp(r.h, 1, maxRows);
  const x = clamp(r.x, 0, cols - w);
  const y = clamp(r.y, 0, maxRows - h);
  return { x, y, w, h };
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
          b.pos = clampToGrid({ ...b.pos, ...b.size }, cols);
          moved = true;
        }
      }
    }
    a.pos = clampToGrid({ ...a.pos, ...a.size }, cols);
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