import fetch from 'node-fetch';
import { describe, expect, it } from 'vitest';

const BASE = process.env.BASE_URL || 'http://localhost:2000';

describe('ingest status', () => {
  it('returns counts and ok', async () => {
    const r = await fetch(`${BASE}/api/ai/ingest/status`);
    expect(r.ok).toBe(true);
    
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
    const r = await fetch(`${BASE}/api/ai/ingest/status`);
    expect(r.ok).toBe(true);
    
    const j = await r.json() as any;
    if (j.chunks > 0) {
      expect(j.updatedAt).toBeTruthy();
      expect(typeof j.updatedAt).toBe('string');
      // Should be a valid ISO string
      expect(() => new Date(j.updatedAt)).not.toThrow();
    }
  });
});
