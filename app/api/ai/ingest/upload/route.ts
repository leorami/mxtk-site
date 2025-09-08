import { textToChunks } from '@/lib/ai/chunk';
import { embedAndLog } from '@/lib/ai/embed';
import { loadVectorStore, saveVectorStore } from '@/lib/ai/vector-store';
import mammoth from 'mammoth';
import { NextRequest, NextResponse } from 'next/server';
// Use pdfjs-dist at runtime to avoid test file path assumptions in pdf-parse

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const source = String(form.get('source') || 'upload');
        const all = form.getAll('file');
        const files: File[] = (all && all.length ? all : [form.get('file')]).filter((f: any) => f instanceof File) as File[];
        if (!files.length) return NextResponse.json({ ok: false, error: 'missing file' }, { status: 400 });

        let totalAdded = 0;
        const details: Array<{ name: string; added?: number; error?: string }> = [];
        const store = await loadVectorStore();

        for (const f of files) {
            const name = (f.name || 'upload').toLowerCase();
            try {
                const buf = Buffer.from(await f.arrayBuffer());
                let text = '';
                if (name.endsWith('.docx')) {
                    const r = await mammoth.extractRawText({ buffer: buf });
                    text = r.value || '';
                } else if (name.endsWith('.pdf')) {
                    try {
                        const pdfjs: any = await import('pdfjs-dist/legacy/build/pdf.mjs');
                        const loadingTask = pdfjs.getDocument({ data: buf });
                        const pdf = await loadingTask.promise;
                        let acc = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            const strings = (content.items || []).map((it: any) => (typeof it?.str === 'string' ? it.str : '')).join(' ');
                            acc += strings + '\n';
                        }
                        text = acc;
                    } catch {
                        details.push({ name: f.name, error: 'Failed to extract text from PDF' });
                        continue;
                    }
                } else if (name.endsWith('.md') || name.endsWith('.txt')) {
                    text = buf.toString('utf8');
                } else {
                    details.push({ name: f.name, error: 'unsupported file type' });
                    continue;
                }
                if (!text.trim()) { details.push({ name: f.name, error: 'empty content' }); continue; }

                const chunks = textToChunks(text, source);
                const embeddings = chunks.length ? await embedAndLog(chunks.map(c => c.text), '/api/ai/ingest/upload') : [];
                store.chunks.push(...chunks);
                store.embeddings.push(...embeddings);
                totalAdded += chunks.length;
                details.push({ name: f.name, added: chunks.length });
            } catch (e: any) {
                details.push({ name: f.name, error: e?.message || 'failed' });
            }
        }
        await saveVectorStore(store);
        return NextResponse.json({ ok: true, added: totalAdded, files: details });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message || 'upload failed' }, { status: 400 });
    }
}


