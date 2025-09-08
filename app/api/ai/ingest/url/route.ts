import { textToChunks } from '@/lib/ai/chunk';
import { embedAndLog } from '@/lib/ai/embed';
import { loadVectorStore, saveVectorStore } from '@/lib/ai/vector-store';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({} as any));
        const url = String(body?.url || '').trim();
        if (!url || !/^https?:\/\//i.test(url)) {
            return NextResponse.json({ ok: false, error: 'invalid url' }, { status: 400 });
        }

        // Fetch HTML with tight timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);
        const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'MXTK-Ingest/1.0' } } as any);
        clearTimeout(timeout);
        if (!res.ok) return NextResponse.json({ ok: false, error: `fetch ${res.status}` }, { status: 400 });
        const html = await res.text();

        // Naive extraction: strip tags, keep link text
        const text = html
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (!text) return NextResponse.json({ ok: false, error: 'empty content' }, { status: 400 });

        const source = new URL(url).pathname || url;
        const chunks = textToChunks(text, source);
        // Attach URL to meta for future linking
        chunks.forEach((c) => ((c as any).meta.url = url));

        const embeddings = await embedAndLog(chunks.map((c) => c.text), '/api/ai/ingest/url');
        const store = await loadVectorStore();
        store.chunks.push(...chunks as any);
        store.embeddings.push(...embeddings);
        await saveVectorStore(store);

        return NextResponse.json({ ok: true, added: chunks.length });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message || 'ingest failed' }, { status: 400 });
    }
}


