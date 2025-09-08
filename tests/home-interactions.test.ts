import type { HomeDoc, Size } from '@/lib/home/gridTypes';
import { addWidget, moveWidget, pinWidget, removeWidget, resizeWidget, togglePinWidget } from '@/lib/home/pureStore';
import { describe, expect, it } from 'vitest';

function makeDoc(): HomeDoc {
    return { id: 'h_test', widgets: [], layoutVersion: 1 };
}

describe('home interactions reducers', () => {
    it('add → resize → move overlapping → pin/unpin → remove (immutable)', () => {
        const base = makeDoc();

        const wSize: Size = { w: 4, h: 3 };
        const afterAdd = addWidget(base, { type: 'recent-answers', title: 'Recent Answers', size: wSize });
        expect(afterAdd.widgets).toHaveLength(1);
        expect(base.widgets).toHaveLength(0);

        const wid = afterAdd.widgets[0].id;

        const afterResize = resizeWidget(afterAdd, wid, { w: 2, h: 1 });
        expect(afterResize.widgets[0].size.w).toBeGreaterThanOrEqual(2);
        expect(afterResize.widgets[0].size.h).toBeGreaterThanOrEqual(1);
        expect(afterResize).not.toBe(afterAdd);

        // Add a second widget that will cause overlap if we move the first onto it
        const afterAdd2 = addWidget(afterResize, { type: 'glossary-spotlight', title: 'Glossary', size: { w: 3, h: 2 } });
        expect(afterAdd2.widgets).toHaveLength(2);

        const targetPos = afterAdd2.widgets[1].pos; // try to move onto widget 2
        const afterMove = moveWidget(afterAdd2, wid, targetPos);
        // Should relocate cleanly to a non-overlapping slot
        const w1 = afterMove.widgets.find(w => w.id === wid)!;
        const w2 = afterMove.widgets.find(w => w.id !== wid)!;
        const overlap = !(
            w1.pos.x >= w2.pos.x + w2.size.w ||
            w1.pos.x + w1.size.w <= w2.pos.x ||
            w1.pos.y >= w2.pos.y + w2.size.h ||
            w1.pos.y + w1.size.h <= w2.pos.y
        );
        expect(overlap).toBe(false);

        // Pin / unpin
        const afterPin = pinWidget(afterMove, wid);
        expect(afterPin.widgets.find(w => w.id === wid)?.pinned).toBe(true);
        const afterToggle = togglePinWidget(afterPin, wid);
        expect(afterToggle.widgets.find(w => w.id === wid)?.pinned).toBe(false);

        // Remove
        const afterRemove = removeWidget(afterToggle, wid);
        expect(afterRemove.widgets.some(w => w.id === wid)).toBe(false);

        // Ensure prior states unchanged (basic immutability check)
        expect(base.widgets).toHaveLength(0);
        expect(afterAdd.widgets).toHaveLength(1);
    });
});


