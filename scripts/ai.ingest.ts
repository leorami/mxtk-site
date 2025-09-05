#!/usr/bin/env node

/**
 * MXTK AI Knowledge Ingestion Script
 * 
 * Usage:
 *   npm run ai:ingest <file-path>
 *   npm run ai:ingest --url <url>
 *   npm run ai:ingest --text "content" --source "source-name"
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileToChunks } from '../lib/ai/chunk';
import { getEmbedder } from '../lib/ai/models';
import { loadVectorStore, saveVectorStore } from '../lib/ai/vector-store';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage:
  npm run ai:ingest <file-path>        # Ingest from file
  npm run ai:ingest --text "content" --source "name"  # Ingest text directly
  
Examples:
  npm run ai:ingest ./docs/whitepaper.md
  npm run ai:ingest --text "MXTK validator incentives..." --source "validator-guide"
`);
    process.exit(1);
  }

  try {
    let chunks, source;
    
    if (args[0] === '--text') {
      const textIndex = args.indexOf('--text');
      const sourceIndex = args.indexOf('--source');
      
      if (textIndex === -1 || sourceIndex === -1) {
        throw new Error('Both --text and --source are required');
      }
      
      const content = args[textIndex + 1];
      source = args[sourceIndex + 1];
      
      if (!content || !source) {
        throw new Error('Both text content and source name must be provided');
      }
      
      const { textToChunks } = await import('../lib/ai/chunk');
      chunks = textToChunks(content, source);
    } else {
      // File-based ingestion
      const filePath = path.resolve(args[0]);
      
      try {
        await fs.access(filePath);
      } catch {
        throw new Error(`File not found: ${filePath}`);
      }
      
      chunks = await fileToChunks(filePath);
      source = path.basename(filePath);
    }
    
    console.log(`Processing ${chunks.length} chunks from ${source}...`);
    
    // Generate embeddings
    const embedder = getEmbedder();
    console.log('Generating embeddings...');
    const embeddings = await embedder.embed(chunks.map(c => c.text));
    
    // Load existing store
    console.log('Loading existing vector store...');
    const store = await loadVectorStore();
    
    // Add new chunks and embeddings
    store.chunks.push(...chunks);
    store.embeddings.push(...embeddings);
    
    // Save updated store
    console.log('Saving updated vector store...');
    await saveVectorStore(store);
    
    console.log(`✅ Successfully ingested ${chunks.length} chunks from ${source}`);
    console.log(`📊 Total chunks in store: ${store.chunks.length}`);
    
  } catch (error) {
    console.error('❌ Ingestion failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
