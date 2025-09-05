import { describe, expect, it } from 'vitest';
import { getEmbedder } from '../lib/ai/models';

describe('embedding', () => {
  it('returns normalized vectors', async () => {
    const emb = getEmbedder();
    const vectors = await emb.embed(['hello']);
    
    expect(Array.isArray(vectors)).toBe(true);
    expect(vectors.length).toBe(1);
    
    const v = vectors[0];
    expect(Array.isArray(v)).toBe(true);
    expect(v.length).toBeGreaterThan(0);
    
    // Calculate vector norm (should be close to 1 for normalized vectors)
    const norm = Math.sqrt(v.reduce((a, b) => a + b * b, 0));
    expect(norm).toBeGreaterThan(0.99);
    expect(norm).toBeLessThan(1.01);
  });
  
  it('handles empty input gracefully', async () => {
    const emb = getEmbedder();
    const vectors = await emb.embed([]);
    
    expect(Array.isArray(vectors)).toBe(true);
    expect(vectors.length).toBe(0);
  });
  
  it('processes multiple texts', async () => {
    const emb = getEmbedder();
    const texts = ['hello', 'world', 'test'];
    const vectors = await emb.embed(texts);
    
    expect(vectors.length).toBe(texts.length);
    
    // Each vector should be normalized
    vectors.forEach(v => {
      const norm = Math.sqrt(v.reduce((a, b) => a + b * b, 0));
      expect(norm).toBeGreaterThan(0.99);
      expect(norm).toBeLessThan(1.01);
    });
  });
});
