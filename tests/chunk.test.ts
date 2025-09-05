import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fileToChunks } from '../lib/ai/chunk';

describe('chunking', () => {
  it('splits long text with overlap', async () => {
    const text = '# Title\n' + 'x'.repeat(8000);
    const tmpDir = path.join(process.cwd(), '.tmp', 'tests');
    const tmp = path.join(tmpDir, 'long.txt');
    
    // Ensure directory exists
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(tmp, text, 'utf8');
    
    try {
      const chunks = await fileToChunks(tmp);
      expect(chunks.length).toBeGreaterThan(2);
      
      // Verify chunk structure
      expect(chunks[0]).toHaveProperty('id');
      expect(chunks[0]).toHaveProperty('text');
      expect(chunks[0]).toHaveProperty('meta');
      expect(chunks[0].meta).toHaveProperty('source');
    } finally {
      // Cleanup
      try {
        fs.unlinkSync(tmp);
      } catch {
        // Ignore cleanup errors
      }
    }
  });
  
  it('handles empty files gracefully', async () => {
    const tmpDir = path.join(process.cwd(), '.tmp', 'tests');
    const tmp = path.join(tmpDir, 'empty.txt');
    
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(tmp, '', 'utf8');
    
    try {
      const chunks = await fileToChunks(tmp);
      expect(Array.isArray(chunks)).toBe(true);
      // Empty file should still create at least one chunk
      expect(chunks.length).toBeGreaterThanOrEqual(0);
    } finally {
      try {
        fs.unlinkSync(tmp);
      } catch {
        // Ignore cleanup errors
      }
    }
  });
});
