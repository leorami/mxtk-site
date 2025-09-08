"use client";
import { useEffect, useState } from 'react';

type VectorStatus = { ok: boolean; chunks: number; embeddings: number };

export default function ToolsPanel() {
    const [status, setStatus] = useState<VectorStatus>({ ok: false, chunks: 0, embeddings: 0 });
    const [busy, setBusy] = useState(false);
    const [note, setNote] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [source, setSource] = useState('admin');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    async function refreshStatus() {
        try {
            const r = await fetch('/api/ai/vector/status', { cache: 'no-store' });
            const j = await r.json();
            setStatus(j);
        } catch {
            setStatus({ ok: false, chunks: 0, embeddings: 0 });
        }
    }

    useEffect(() => { void refreshStatus(); }, []);

    async function doReset() {
        setBusy(true); setErr(null); setNote(null);
        try {
            const r = await fetch('/api/ai/vector/reset', { method: 'POST' });
            if (!r.ok) throw new Error('Reset failed');
            setNote('Vector store reset.');
            await refreshStatus();
        } catch (e: any) {
            setErr(e?.message || 'Reset failed');
        } finally { setBusy(false); }
    }

    async function doIngestText() {
        if (!content.trim() || !source.trim()) { setErr('Provide source and content'); return; }
        setBusy(true); setErr(null); setNote(null);
        try {
            const r = await fetch('/api/ai/ingest', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ source: source.trim(), content }),
            });
            const j = await r.json();
            if (!r.ok || j?.ok === false) throw new Error(j?.error || 'Ingest failed');
            setNote(`Ingested ${j?.chunksAdded ?? '?'} chunks from ${source.trim()}`);
            await refreshStatus();
        } catch (e: any) { setErr(e?.message || 'Ingest failed'); } finally { setBusy(false); }
    }

    async function doUpload() {
        if (!files.length || !source.trim()) { setErr('Choose file(s) and source'); return; }
        setBusy(true); setErr(null); setNote(null);
        try {
            const fd = new FormData();
            fd.set('source', source.trim());
            for (const f of files) fd.append('file', f);
            const r = await fetch('/api/ai/ingest/upload', { method: 'POST', body: fd });
            const j = await r.json().catch(() => ({}));
            if (!r.ok || j?.ok === false) throw new Error(j?.error || 'Upload failed');
            setNote(`Uploaded ${files.length} file(s); ingested ${j?.added ?? '?'} chunks from ${source.trim()}`);
            await refreshStatus();
        } catch (e: any) { setErr(e?.message || 'Upload failed'); } finally { setBusy(false); }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-xl border p-4">
                <h2 className="font-semibold mb-2">Vector Store</h2>
                <div className="text-sm mb-3">Chunks: {status?.chunks ?? 0} · Embeddings: {status?.embeddings ?? 0}</div>
                <div className="flex gap-2">
                    <button type="button" className="btn btn-sm" onClick={doReset} disabled={busy}>Reset Store</button>
                    <button type="button" className="btn btn-sm" onClick={refreshStatus} disabled={busy}>Refresh</button>
                </div>
            </section>

            <section className="rounded-xl border p-4 space-y-2">
                <h2 className="font-semibold mb-2">Ingest Content</h2>
                <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="source name (e.g., overview)" className="input input-sm w-full" />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Paste plain text or markdown to ingest" className="textarea w-full" />
                <div className="flex gap-2">
                    <button type="button" className="btn btn-sm" onClick={doIngestText} disabled={busy}>Ingest Text</button>
                </div>
            </section>

            <section className="rounded-xl border p-4 space-y-2">
                <h2 className="font-semibold mb-2">Ingest File (DOCX, PDF, MD, TXT)</h2>
                <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} accept=".docx,.pdf,.md,.txt" className="input input-sm w-full" />
                <div className="flex gap-2">
                    <button type="button" className="btn btn-sm" onClick={doUpload} disabled={busy}>Upload & Ingest</button>
                </div>
                <div className="text-xs opacity-70">We extract text from DOCX/PDF automatically when available.</div>
            </section>

            {(note || err) && (
                <div role="status" className={`text-sm ${err ? 'text-red-600' : 'text-green-700'}`}>{err || note}</div>
            )}
        </div>
    );
}


