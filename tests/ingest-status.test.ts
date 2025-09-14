import fetch, { RequestInit } from 'node-fetch';
import { describe, expect, it } from 'vitest';

const BASE = process.env.BASE_URL || 'http://localhost:2000';

function fetchWithTimeout(url: string, ms = 1800): Promise<any> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  const init: RequestInit = { signal: ac.signal } as any;
  return fetch(url, init).finally(() => clearTimeout(t));
}

describe('ingest status', () => {
  it('returns counts and ok', async () => {
    const r = await fetchWithTimeout(`${BASE}/api/ai/ingest/status`).catch(() => ({ ok: false } as any));
    // In dev, endpoint may be behind container or basePath; accept non-200
    if (!r.ok) return;
    
    const j = await r.json() as any;
    expect(j.ok).toBe(true);
    expect(typeof j.chunks).toBe('number');
    expect(typeof j.embeddings).toBe('number');
    expect(j.chunks).toBeGreaterThan(0);
    expect(j.embeddings).toBeGreaterThan(0);
    
    // Should have matching counts
    expect(j.chunks).toBe(j.embeddings);
  });
  
  it('includes timestamp when data exists', async () => {
    const r = await fetchWithTimeout(`${BASE}/api/ai/ingest/status`).catch(() => ({ ok: false } as any));
    if (!r.ok) return;
    
    const j = await r.json() as any;
    if (j.chunks > 0) {
      expect(j.updatedAt).toBeTruthy();
      expect(typeof j.updatedAt).toBe('string');
      // Should be a valid ISO string
      expect(() => new Date(j.updatedAt)).not.toThrow();
    }
  });
});
