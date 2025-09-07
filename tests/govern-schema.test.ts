import { zFlag, zQuery, zReviewAction } from '@/lib/ai/govern/schema';
import { describe, expect, it } from 'vitest';

describe('governance schemas', () => {
  it('validates a good Flag', () => {
    const good = {
      id: 'f1',
      createdAt: Date.now(),
      source: 'ingest',
      reason: 'Contains possible PII',
      status: 'open',
      severity: 2,
      labels: ['needs-review'],
    };
    const r = zFlag.safeParse(good);
    expect(r.success).toBe(true);
  });

  it('rejects invalid enums and long strings', () => {
    const bad = {
      id: 'f2',
      createdAt: Date.now(),
      source: 'bad-src',
      reason: 'x'.repeat(2100),
      status: 'nope',
    } as any;
    const r = zFlag.safeParse(bad);
    expect(r.success).toBe(false);
  });

  it('validates ReviewAction', () => {
    const good = {
      id: 'r1',
      flagId: 'f1',
      at: Date.now(),
      actor: 'tester',
      action: 'resolve',
      payload: { note: 'Handled', labels: ['ok'] },
    };
    const r = zReviewAction.safeParse(good);
    expect(r.success).toBe(true);
  });

  it('rejects ReviewAction with bad action', () => {
    const bad = {
      id: 'r2',
      flagId: 'f1',
      at: Date.now(),
      actor: 'tester',
      action: 'approve',
    } as any;
    const r = zReviewAction.safeParse(bad);
    expect(r.success).toBe(false);
  });

  it('validates query filters', () => {
    const r1 = zQuery.safeParse({ status: 'open', limit: 50 });
    expect(r1.success).toBe(true);
    const r2 = zQuery.safeParse({ status: 'nope' });
    expect(r2.success).toBe(false);
  });
});


