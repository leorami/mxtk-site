import { textToChunks } from '@/lib/ai/chunk';
import { IngestRequestSchema, getEmbedder } from '@/lib/ai/models';
import { loadVectorStore, saveVectorStore } from '@/lib/ai/vector-store';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = IngestRequestSchema.parse(body);
    
    // Create chunks from content
    const chunks = textToChunks(parsed.content, parsed.source);
    
    // Generate embeddings
    const embedder = getEmbedder();
    const embeddings = await embedder.embed(chunks.map(c => c.text));
    
    // Load existing store and append new data
    const store = await loadVectorStore();
    store.chunks.push(...chunks);
    store.embeddings.push(...embeddings);
    
    // Save updated store
    await saveVectorStore(store);
    
    return NextResponse.json({
      ok: true,
      message: `Ingested ${chunks.length} chunks from ${parsed.source}`,
      chunksAdded: chunks.length,
      totalChunks: store.chunks.length,
    });
  } catch (error) {
    console.error('AI ingest error:', error);
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 400 });
  }
}
