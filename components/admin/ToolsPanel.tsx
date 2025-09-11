"use client";
import { apiGet, apiPost, getApiUrl } from '@/lib/api';
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
            const j = await apiGet<VectorStatus>('/ai/vector/status', { cache: 'no-store' });
            setStatus(j);
        } catch {
            setStatus({ ok: false, chunks: 0, embeddings: 0 });
        }
    }

    useEffect(() => { void refreshStatus(); }, []);

    async function doReset() {
        setBusy(true); setErr(null); setNote(null);
        try {
            await apiPost('/ai/vector/reset');
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
            const j: any = await apiPost('/ai/ingest', { source: source.trim(), content });
            if (j?.ok === false) throw new Error(j?.error || 'Ingest failed');
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
            const r = await fetch(getApiUrl('/ai/ingest/upload'), { method: 'POST', body: fd });
            const j = await r.json().catch(() => ({}));
            if (!r.ok || j?.ok === false) throw new Error(j?.error || 'Upload failed');
            setNote(`Uploaded ${files.length} file(s); ingested ${j?.added ?? '?'} chunks from ${source.trim()}`);
            await refreshStatus();
        } catch (e: any) { setErr(e?.message || 'Upload failed'); } finally { setBusy(false); }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-card)] p-4">
                <h2 className="font-semibold mb-2 text-[var(--ink-strong)] dark:text-[var(--ink-strong)]">Vector Store</h2>
                <div className="text-sm mb-3 text-[var(--ink-muted)] dark:text-[var(--ink-muted)]">Chunks: {status?.chunks ?? 0} · Embeddings: {status?.embeddings ?? 0}</div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        type="button"
                        className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 w-full sm:w-auto"
                        onClick={doReset}
                        disabled={busy}
                        title="Reset vector store (destructive action)"
                    >
                        Reset Store
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm bg-[var(--mxtk-orange)] hover:bg-[var(--mxtk-orange)]/90 text-white w-full sm:w-auto"
                        onClick={refreshStatus}
                        disabled={busy}
                        title="Refresh store status"
                    >
                        Refresh
                    </button>
                </div>
            </section>

            <section className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-card)] p-4 space-y-2">
                <h2 className="font-semibold mb-2 text-[var(--ink-strong)] dark:text-[var(--ink-strong)]">Ingest Content</h2>
                <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="source name (e.g., overview)"
                    className="input input-sm w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-[var(--border-soft)] focus:border-[var(--mxtk-orange)] focus:ring-2 focus:ring-[var(--mxtk-orange)]/20"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    placeholder="Paste plain text or markdown to ingest"
                    className="textarea w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-[var(--border-soft)] focus:border-[var(--mxtk-orange)] focus:ring-2 focus:ring-[var(--mxtk-orange)]/20"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        type="button"
                        className="btn btn-sm bg-[var(--mxtk-orange)] hover:bg-[var(--mxtk-orange)]/90 text-white w-full sm:w-auto"
                        onClick={doIngestText}
                        disabled={busy}
                        title="Ingest text content into vector store"
                    >
                        Ingest Text
                    </button>
                </div>
            </section>

            <section className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-card)] p-4 space-y-2">
                <h2 className="font-semibold mb-2 text-[var(--ink-strong)] dark:text-[var(--ink-strong)]">Ingest File (DOCX, PDF, MD, TXT)</h2>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    accept=".docx,.pdf,.md,.txt"
                    className="input input-sm w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-[var(--border-soft)] focus:border-[var(--mxtk-orange)] focus:ring-2 focus:ring-[var(--mxtk-orange)]/20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--mxtk-orange)] file:text-white hover:file:bg-[var(--mxtk-orange)]/90"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        type="button"
                        className="btn btn-sm bg-[var(--mxtk-orange)] hover:bg-[var(--mxtk-orange)]/90 text-white w-full sm:w-auto"
                        onClick={doUpload}
                        disabled={busy}
                        title="Upload and ingest files into vector store"
                    >
                        Upload & Ingest
                    </button>
                </div>
                <div className="text-xs text-[var(--ink-muted)] dark:text-[var(--ink-muted)]">We extract text from DOCX/PDF automatically when available.</div>
            </section>

            {(note || err) && (
                <div role="status" className={`text-sm rounded-lg p-3 border ${err ? 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/20 dark:border-red-800' : 'text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-900/20 dark:border-green-800'}`}>
                    {err || note}
                </div>
            )}
        </div>
    );
}


