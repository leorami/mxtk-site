import { flagText } from '@/lib/ai/govern/flag';
import { describe, expect, it } from 'vitest';

describe('flagText', () => {
  it('flags patent-like text', async () => {
    const r = await flagText('This contains patent claims and is confidential.');
    expect(r.risk).toBeGreaterThanOrEqual(0.5);
    expect(r.labels).toContain('needs-review');
  });

  it('downweights public docs', async () => {
    const r = await flagText('Public site: https://example.com whitepaper');
    expect(r.risk).toBeLessThan(0.5);
  });
});


