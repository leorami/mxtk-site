import { describe, expect, it } from 'vitest';
import { recordSignal, getSignals } from '@/lib/ai/govern/signals';

describe('govern signals', () => {
  it('records and retrieves signals, truncating long notes', async () => {
    const s1 = await recordSignal({ flagId: 'f1', at: Date.now(), labelSet: ['ok'], category: 'policy', note: 'a'.repeat(3000) });
    const s2 = await recordSignal({ flagId: 'f2', at: Date.now(), labelSet: ['spam', 'abuse'], category: 'abuse' });
    expect(s1.id).toBeTruthy();
    expect(s1.note!.length).toBeLessThanOrEqual(2000);

    const { items } = await getSignals({ limit: 10 });
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[0]).toHaveProperty('flagId');
  });
});


