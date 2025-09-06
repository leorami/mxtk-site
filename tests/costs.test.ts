import { estimateUSD } from '@/lib/ai/ops/costs';
import { describe, expect, it } from 'vitest';

describe('cost estimation', () => {
  it('computes usd from tokens', () => {
    const usd = estimateUSD(2000, 1000, { in: 0.3, out: 0.6 });
    expect(usd).toBeCloseTo(1.2, 5);
  });
});


