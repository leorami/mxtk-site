/* eslint-disable no-console */
import { getEmbedder } from '../lib/ai/models';
import { loadVectorStore, saveVectorStore } from '../lib/ai/vector-store';

async function main() {
  const store = await loadVectorStore();
  if (!store.chunks.length) {
    console.log('Vector store empty, nothing to re-embed.');
    return;
  }
  const embedder = getEmbedder();
  console.log('Re-embedding', store.chunks.length, 'chunks...');
  const embeddings = await embedder.embed(store.chunks.map(c => c.text));
  store.embeddings = embeddings as any;
  await saveVectorStore(store);
  console.log('✅ Re-embed complete.');
}

main().catch((e) => { console.error(e); process.exit(1); });
