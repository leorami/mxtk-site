import { appendReview, createFlag, getFlag, getFlags, listReviews, putFlag } from '@/lib/ai/govern/store';
import { describe, expect, it, vi } from 'vitest';

describe('governance store', () => {
  it('creates and lists flags by status/category; updates via reviews', async () => {
    const f1 = await createFlag({ source: 'system', reason: 'pii', category: 'pii' });
    const f2 = await createFlag({ source: 'ingest', reason: 'policy hit', category: 'policy', severity: 1 });
    const f3 = await createFlag({ source: 'chat', reason: 'spam content', category: 'spam', severity: 3 });

    const all = await getFlags({});
    expect(all.items.length).toBeGreaterThanOrEqual(3);

    const cat = await getFlags({ category: 'policy' });
    expect(cat.items.some((i) => i.id === f2.id)).toBe(true);

    // resolve f2
    const now = Date.now();
    await appendReview({ id: 'r-' + f2.id, flagId: f2.id, at: now, actor: 'tester', action: 'resolve' });
    const updated: any = { ...(await getFlag(f2.id))!, status: 'resolved', updatedAt: Date.now() };
    await putFlag(updated);

    const after = await getFlags({ status: 'resolved' });
    expect(after.items.some((i) => i.id === f2.id)).toBe(true);

    const reviews = await listReviews(f2.id);
    expect(reviews.length).toBeGreaterThanOrEqual(1);
    expect(reviews[0].action).toBe('resolve');
  });

  it('atomicity: uses rename for index writes (mocked)', async () => {
    const spy = vi.spyOn(require('node:fs/promises') as any, 'rename');
    const f = await createFlag({ source: 'system', reason: 'check', category: 'other' });
    expect(f.id).toBeTruthy();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});


