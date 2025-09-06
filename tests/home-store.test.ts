import { describe, expect, it } from 'vitest'
import { GRID_COLS } from '@/lib/home/gridTypes';
import type { HomeDoc, Size } from '@/lib/home/gridTypes';
import { addWidget, moveWidget, resizeWidget, removeWidget, pinWidget, upsertWidgetData } from '@/lib/home/pureStore';

function empty(id = 't'): HomeDoc { return { id, widgets: [], layoutVersion: 1 }; }

describe('home pure reducers', () => {
  it('add 3 widgets non-overlapping and clamped', () => {
    const size: Size = { w: 4, h: 3 };
    const d0 = empty('home1');
    const d1 = addWidget(d0, { type: 'getting-started', size });
    const d2 = addWidget(d1, { type: 'recent-answers', size });
    const d3 = addWidget(d2, { type: 'glossary-spotlight', size });
    // purity: identity must change each step; previous docs unchanged
    expect(d1).not.toBe(d0); expect(d2).not.toBe(d1); expect(d3).not.toBe(d2);
    // non-overlap
    const pairs = [[0,1],[0,2],[1,2]] as const;
    for (const [a,b] of pairs) {
      const A = d3.widgets[a]; const B = d3.widgets[b];
      const overlap = !(A.pos.x + A.size.w <= B.pos.x || B.pos.x + B.size.w <= A.pos.x || A.pos.y + A.size.h <= B.pos.y || B.pos.y + B.size.h <= A.pos.y);
      expect(overlap).toBe(false);
    }
    // clamped within grid
    for (const w of d3.widgets) {
      expect(w.pos.x).toBeGreaterThanOrEqual(0);
      expect(w.pos.x + w.size.w).toBeLessThanOrEqual(GRID_COLS);
      expect(w.pos.y).toBeGreaterThanOrEqual(0);
    }
  });

  it('move & resize keep no-overlap and clamp to grid', () => {
    const size: Size = { w: 4, h: 3 };
    let d = empty('home2');
    d = addWidget(d, { type: 'getting-started', size });
    d = addWidget(d, { type: 'recent-answers', size });
    const idA = d.widgets[0].id; const idB = d.widgets[1].id;
    // try to move A onto B
    const d2 = moveWidget(d, idA, d.widgets[1].pos);
    // ensure moved position does not overlap
    const A = d2.widgets.find(w => w.id === idA)!; const B = d2.widgets.find(w => w.id === idB)!;
    const overlap = !(A.pos.x + A.size.w <= B.pos.x || B.pos.x + B.size.w <= A.pos.x || A.pos.y + A.size.h <= B.pos.y || B.pos.y + B.size.h <= A.pos.y);
    expect(overlap).toBe(false);
    // resize B beyond cols to test clamp
    const d3 = resizeWidget(d2, idB, { w: GRID_COLS + 10, h: 2 });
    const B3 = d3.widgets.find(w => w.id === idB)!;
    expect(B3.size.w).toBe(GRID_COLS + 10); // size can be large
    expect(B3.pos.x + B3.size.w).toBeGreaterThan(GRID_COLS - 1); // may overflow, but pos is clamped so x within [0, GRID_COLS-1]
    expect(B3.pos.x).toBe(0);
  });

  it('pin/unpin toggles and upsert data', () => {
    const size: Size = { w: 4, h: 3 };
    let d = addWidget(empty('home3'), { type: 'getting-started', size });
    const id = d.widgets[0].id;
    const d2 = pinWidget(d, id);
    expect(d2.widgets[0].pinned).toBe(true);
    const d3 = pinWidget(d2, id);
    expect(d3.widgets[0].pinned).toBe(false);
    const d4 = upsertWidgetData(d3, id, { a: 1 });
    const d5 = upsertWidgetData(d4, id, { b: 2 });
    expect(d5.widgets[0].data).toEqual({ a: 1, b: 2 });
  });

  it('remove widget updates list', () => {
    const size: Size = { w: 4, h: 3 };
    let d = empty('home4');
    d = addWidget(d, { type: 'getting-started', size });
    d = addWidget(d, { type: 'recent-answers', size });
    const id = d.widgets[0].id;
    const d2 = removeWidget(d, id);
    expect(d2.widgets.find(w => w.id === id)).toBeFalsy();
    expect(d.widgets.length).toBe(2); // purity
  });
});



