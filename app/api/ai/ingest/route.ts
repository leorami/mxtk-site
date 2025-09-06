import { textToChunks } from '@/lib/ai/chunk';
import { embedAndLog } from '@/lib/ai/embed';
import { flagText } from '@/lib/ai/govern/flag';
import { upsertPending } from '@/lib/ai/govern/store';
import { IngestRequestSchema } from '@/lib/ai/models';
import { loadVectorStore, saveVectorStore } from '@/lib/ai/vector-store';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = IngestRequestSchema.parse(body);
    
    // Create chunks from content
    const chunks = textToChunks(parsed.content, parsed.source);

    // Flag and quarantine risky chunks before embedding
    const flaggedIds = new Set<string>();
    await Promise.all(
      chunks.map(async (c) => {
        const res = await flagText(c.text, c.meta);
        if (res.risk >= 0.5) {
          flaggedIds.add(c.id);
          await upsertPending({
            id: c.id,
            meta: c.meta,
            risk: res.risk,
            reasons: res.reasons,
            labels: res.labels,
            textHash: String((c.text || '').length) +
              '-' + Buffer.from((c.text || '').slice(0, 64)).toString('base64'),
          });
        }
      })
    );

    // Only embed non-quarantined chunks
    // mark quarantined on flagged chunks; persist only non-quarantined to vectors now
    for (const c of chunks) {
      if (flaggedIds.has(c.id)) (c as any).quarantined = true;
    }
    const toEmbed = chunks.filter(c => !flaggedIds.has(c.id));
    const embeddings = toEmbed.length ? await embedAndLog(toEmbed.map(c => c.text), '/api/ai/ingest') : [];

    // Load existing store and append new data, preserving index alignment
    const store = await loadVectorStore();
    let eIdx = 0;
    for (const c of chunks) {
      if (flaggedIds.has(c.id)) {
        (c as any).quarantined = true;
        store.chunks.push(c as any);
        store.embeddings.push(null);
      } else {
        store.chunks.push(c as any);
        store.embeddings.push(embeddings[eIdx++] || null);
      }
    }
    
    // Save updated store
    await saveVectorStore(store);
    
    return NextResponse.json({
      ok: true,
      message: `Ingested ${chunks.length} chunks from ${parsed.source}`,
      chunksAdded: toEmbed.length,
      quarantined: flaggedIds.size,
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
