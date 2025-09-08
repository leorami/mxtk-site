import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

export async function GET() {
    const base = process.env.AI_VECTOR_DIR || './ai_store';
    const chunksPath = path.join(process.cwd(), base, 'chunks.json');
    const embedsPath = path.join(process.cwd(), base, 'embeddings.json');
    let chunks = 0, embeds = 0;
    try { chunks = JSON.parse(await fs.readFile(chunksPath, 'utf8')).length || 0; } catch { }
    try { embeds = JSON.parse(await fs.readFile(embedsPath, 'utf8')).length || 0; } catch { }
    return NextResponse.json({ ok: true, chunks, embeddings: embeds });
}


