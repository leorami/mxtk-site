import { embedAndLog } from '@/lib/ai/embed';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Chunk, EmbeddingVector } from './models';

const STORE_DIR = process.env.AI_VECTOR_DIR || './ai_store';

export interface VectorStore {
  chunks: Chunk[];
  embeddings: (EmbeddingVector | null)[];
}

export async function loadVectorStore(): Promise<VectorStore> {
  try {
    const chunksPath = path.join(process.cwd(), STORE_DIR, 'chunks.json');
    const embeddingsPath = path.join(process.cwd(), STORE_DIR, 'embeddings.json');

    const [chunksData, embeddingsData] = await Promise.all([
      fs.readFile(chunksPath, 'utf8'),
      fs.readFile(embeddingsPath, 'utf8'),
    ]);

    return {
      chunks: JSON.parse(chunksData),
      embeddings: JSON.parse(embeddingsData),
    } as VectorStore;
  } catch (error) {
    console.warn('Vector store not found, returning empty store:', error);
    return { chunks: [], embeddings: [] };
  }
}

export async function saveVectorStore(store: VectorStore): Promise<void> {
  const storeDir = path.join(process.cwd(), STORE_DIR);
  await fs.mkdir(storeDir, { recursive: true });

  await Promise.all([
    fs.writeFile(
      path.join(storeDir, 'chunks.json'),
      JSON.stringify(store.chunks, null, 2)
    ),
    fs.writeFile(
      path.join(storeDir, 'embeddings.json'),
      JSON.stringify(store.embeddings, null, 2)
    ),
  ]);
}

export function cosineSimilarity(a: EmbeddingVector, b: EmbeddingVector | undefined | null): number {
  if (!b || !Array.isArray(b) || a.length === 0 || b.length === 0) return 0;
  const n = Math.min(a.length, b.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < n; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dotProduct += av * bv;
    normA += av * av;
    normB += bv * bv;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (!Number.isFinite(denom) || denom === 0) return 0;
  const sim = dotProduct / denom;
  return Number.isFinite(sim) ? sim : 0;
}

export async function searchSimilar(
  query: string,
  embedder: { embed: (texts: string[]) => Promise<EmbeddingVector[]> },
  limit: number = 5
): Promise<Array<{ chunk: Chunk; score: number }>> {
  const store = await loadVectorStore();

  if (store.chunks.length === 0) {
    return [];
  }

  const [queryEmbedding] = await embedder.embed([query]);

  // If existing embeddings were generated with a different dimension (e.g., mock vs live),
  // rebuild them using the current embedder to ensure cosine similarity is meaningful.
  try {
    const existingDim = (store.embeddings.find((e) => Array.isArray(e)) as EmbeddingVector | undefined)?.length || 0;
    const currentDim = Array.isArray(queryEmbedding) ? queryEmbedding.length : 0;
    if (existingDim > 0 && currentDim > 0 && existingDim !== currentDim) {
      const indicesToEmbed: number[] = [];
      const textsToEmbed: string[] = [];
      for (let i = 0; i < store.chunks.length; i++) {
        if (store.embeddings[i] !== null) {
          indicesToEmbed.push(i);
          textsToEmbed.push(store.chunks[i].text);
        }
      }
      if (textsToEmbed.length > 0) {
        const rebuilt = await embedAndLog(textsToEmbed, 'vector-reembed');
        let r = 0;
        for (const idx of indicesToEmbed) {
          (store.embeddings as (EmbeddingVector | null)[])[idx] = rebuilt[r++] || [];
        }
        await saveVectorStore(store);
      }
    }
  } catch { }

  const results = store.chunks
    .map((chunk, index) => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, store.embeddings[index]),
    }))
    .filter(r => r.score > 0); // drop quarantined (null embedding)

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
