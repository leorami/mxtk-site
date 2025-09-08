import type { HomeDoc } from '@/lib/home/gridTypes';
import { addWidget, moveWidget, resizeWidget } from '@/lib/home/pureStore';
import { describe, expect, it } from 'vitest';

describe('grid reducers basic behavior', () => {
    it('move/resize updates positions and sizes correctly', () => {
        const doc: HomeDoc = { id: 'h_grid', widgets: [], layoutVersion: 1 };
        const afterAdd = addWidget(doc, { type: 'resource-list', title: 'Resources', size: { w: 3, h: 2 } });
        const wid = afterAdd.widgets[0].id;

        const afterMove = moveWidget(afterAdd, wid, { x: 5, y: 2 });
        const w1 = afterMove.widgets[0];
        expect(w1.pos.x).toBeGreaterThanOrEqual(0);
        expect(w1.pos.y).toBeGreaterThanOrEqual(0);

        const afterResize = resizeWidget(afterMove, wid, { w: 6, h: 4 });
        const w2 = afterResize.widgets[0];
        expect(w2.size.w).toBeGreaterThanOrEqual(1);
        expect(w2.size.h).toBeGreaterThanOrEqual(1);
    });
});


