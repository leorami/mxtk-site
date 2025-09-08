import { ensureHome, getHome, putHome } from '@/lib/home/fileStore';
import { addWidget } from '@/lib/home/pureStore';
import { describe, expect, it } from 'vitest';

describe('home PATCH api logic (store-level)', () => {
    it('resize/move/remove flows persist via fileStore', async () => {
        const home = await ensureHome('h_patch_test');
        let doc = addWidget(home, { type: 'custom-note', title: 'Note', size: { w: 3, h: 2 } });
        doc = addWidget(doc, { type: 'glossary-spotlight', title: 'Glossary', size: { w: 3, h: 2 } });
        await putHome(doc);

        const wid = doc.widgets[0].id;

        // Simulate PATCH resize
        const { resizeWidget, moveWidget, removeWidget } = await import('@/lib/home/pureStore');
        let next = resizeWidget(doc, wid, { w: 4, h: 3 });
        next = moveWidget(next, wid, { x: 2, y: 1 });
        next = removeWidget(next, wid);
        await putHome(next);

        const saved = await getHome(doc.id);
        expect(saved?.widgets.some(w => w.id === wid)).toBe(false);
    });
});


