import fs from 'node:fs/promises';
import path from 'node:path';

export type ChunkMeta = {
  id: string;
  text: string;
  meta: {
    source: string;
    page?: number;
    section?: string;
  };
};

export async function resolveCitations(ids: string[]) {
  const base = process.env.AI_VECTOR_DIR || './ai_store';
  const p = path.join(process.cwd(), base, 'chunks.json');
  
  try {
    const raw = JSON.parse(await fs.readFile(p, 'utf8')) as ChunkMeta[];
    const index = new Map(raw.map(c => [c.id, c]));
    
    return ids.map(id => {
      const c = index.get(id);
      return c ? {
        id,
        source: c.meta.source,
        page: c.meta.page,
        section: c.meta.section
      } : { id };
    });
  } catch {
    return ids.map(id => ({ id }));
  }
}
