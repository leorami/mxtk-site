import { describe, it, expect } from 'vitest';
import { parseFacts, sanitizeFacts } from '../lib/facts/schema';

describe('facts schema', () => {
  it('accepts a valid document', () => {
    const input = {
      version: 1,
      updatedAt: Date.now(),
      data: {
        project: { name: 'MXTK', tagline: 'Transparent finance' },
        assets: { committedUSD: 1000, categories: ['defi', 'otc'] },
        governance: { policyUrl: 'https://example.com/policy', contact: 'ops@mxtk.ai' },
        models: { suggest: ['s1'], answer: ['a1'], deep: ['d1'], embeddings: 'text-embedding-3-large' },
        links: { homepage: 'https://mxtk.ai' },
        misc: { note: true },
      },
    };
    const out = parseFacts(input);
    expect(out.data.project.name).toBe('MXTK');
  });

  it('rejects negative numbers and wrong types', () => {
    const bad = {
      version: 1,
      updatedAt: Date.now(),
      data: {
        project: { name: 'MXTK' },
        assets: { committedUSD: -5 },
      },
    } as any;
    expect(() => parseFacts(bad)).toThrow(/Invalid FactsDoc/);
  });

  it('trims oversize strings down by failing with a clear message', () => {
    const long = 'x'.repeat(600);
    const bad = {
      version: 1,
      updatedAt: Date.now(),
      data: { project: { name: long } },
    } as any;
    expect(() => sanitizeFacts(bad)).toThrow();
  });
});


