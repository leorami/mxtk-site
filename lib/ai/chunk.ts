import fs from 'node:fs/promises';
import path from 'node:path';
import type { Chunk } from './models';

export async function fileToChunks(filePath: string): Promise<Chunk[]> {
  const content = await fs.readFile(filePath, 'utf8');
  const source = path.basename(filePath);
  
  return textToChunks(content, source);
}

export function textToChunks(text: string, source: string): Chunk[] {
  const chunkSize = 4000;
  const overlap = 200;
  const chunks: Chunk[] = [];
  
  // Simple chunking by character count with overlap
  let start = 0;
  let chunkIndex = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunkText = text.slice(start, end);
    
    chunks.push({
      id: `${source}-${chunkIndex}`,
      text: chunkText,
      meta: {
        source,
        section: extractSection(chunkText),
      }
    });
    
    chunkIndex++;
    start += chunkSize - overlap;
  }
  
  return chunks;
}

function extractSection(text: string): string | undefined {
  // Extract heading from markdown-style text
  const headingMatch = text.match(/^#+\s*(.+)$/m);
  return headingMatch?.[1];
}
