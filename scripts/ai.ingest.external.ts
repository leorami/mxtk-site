/*
  Ingest latest mineral-token.com rendered text into the vector store and regenerate embeddings as needed.
  Usage:
    pnpm tsx scripts/ai.ingest.external.ts --domain mineral-token.com
*/

/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';
import { textToChunks } from '../lib/ai/chunk';
import { getEmbedder } from '../lib/ai/models';
import { loadVectorStore, saveVectorStore } from '../lib/ai/vector-store';

function latestSnapshotDir(domain: string): string | null {
  const base = path.join('docs', 'reference', 'external', domain);
  if (!fs.existsSync(base)) return null;
  const dirs = fs.readdirSync(base)
    .map((n) => path.join(base, n))
    .filter((p) => fs.statSync(p).isDirectory())
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return dirs[0] || null;
}

async function main() {
  const domain = process.argv.includes('--domain') ? process.argv[process.argv.indexOf('--domain') + 1] : 'mineral-token.com';
  const snap = latestSnapshotDir(domain);
  if (!snap) {
    console.error('No snapshot found for domain:', domain);
    process.exit(1);
  }
  const renderedTxt = path.join(snap, 'rendered', 'index.rendered.txt');
  const rawHtml = path.join(snap, 'raw', 'index.html');

  const texts: Array<{ content: string; source: string; meta?: Record<string, any> }> = [];
  if (fs.existsSync(renderedTxt)) {
    texts.push({ content: fs.readFileSync(renderedTxt, 'utf8'), source: `${domain}-rendered-index` });
  }
  if (fs.existsSync(rawHtml)) {
    const html = fs.readFileSync(rawHtml, 'utf8');
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) texts.push({ content: text, source: `${domain}-raw-index` });
  }
  if (texts.length === 0) {
    console.error('No content found to ingest.');
    process.exit(1);
  }

  const embedder = getEmbedder();
  const store = await loadVectorStore();

  for (const t of texts) {
    const chunks = textToChunks(t.content, t.source);
    console.log('Embedding', chunks.length, 'chunks from', t.source);
    const embeddings = await embedder.embed(chunks.map((c) => c.text));
    store.chunks.push(...(chunks as any));
    store.embeddings.push(...embeddings);
  }
  await saveVectorStore(store);
  console.log('✅ Ingest complete. Chunks:', store.chunks.length);
}

main().catch((e) => { console.error(e); process.exit(1); });
