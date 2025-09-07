"use client";
import { useEffect, useState } from 'react';

type Detail = {
  id: string;
  createdAt: number;
  updatedAt?: number;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed' | 'escalated';
  category?: string;
  severity?: 1 | 2 | 3;
  journeyId?: string;
  messageId?: string;
  reason: string;
  labels?: string[];
  metadata?: Record<string, unknown>;
  notes?: string[];
};

export default function FlagDetailPanel({ id, onClose, onAction }: { id: string; onClose: () => void; onAction: (id: string, action: Detail['status'] | 'reopen', payload?: { note?: string; labels?: string[]; category?: string }) => Promise<void> }) {
  const [data, setData] = useState<Detail | null>(null);
  const [note, setNote] = useState('');
  const [labels, setLabels] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      const r = await fetch(`/api/ai/flags/${id}`, { headers: { 'cache-control': 'no-store' } });
      if (alive) setData(r.ok ? await r.json() : null);
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (!data) return null;
  const labelArr = labels.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <section role="region" aria-label={`Flag detail ${id}`} className="mt-4 p-4 rounded-xl border glass">
      <div className="flex items-start justify-between">
        <h2 className="font-semibold">Flag {id.slice(0, 8)}</h2>
        <button className="underline" onClick={onClose} aria-label="Close detail">Close</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-3">
        <div>
          <div className="text-xs opacity-70">Reason</div>
          <p className="whitespace-pre-wrap break-words">{data.reason}</p>
          <div className="text-xs opacity-70 mt-2">Metadata</div>
          <pre className="text-xs max-h-48 overflow-auto bg-transparent">{JSON.stringify(data.metadata || {}, null, 2)}</pre>
          <div className="text-xs opacity-70 mt-2">Links</div>
          <ul className="text-sm list-disc pl-4">
            {data.journeyId && <li>Journey: <a className="underline" href={`/journey?id=${encodeURIComponent(data.journeyId)}`}>{data.journeyId}</a></li>}
            {data.messageId && <li>Message: <a className="underline" href={`#message-${encodeURIComponent(data.messageId)}`}>{data.messageId}</a></li>}
          </ul>
        </div>
        <div>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs opacity-70">Add note</label>
              <input value={note} onChange={(e)=> setNote(e.target.value)} className="rounded border px-2 py-1 w-full bg-white text-black dark:bg-zinc-900 dark:text-white" aria-label="Add note" />
            </div>
            <div>
              <label className="block text-xs opacity-70">Labels (comma)</label>
              <input value={labels} onChange={(e)=> setLabels(e.target.value)} className="rounded border px-2 py-1 w-full bg-white text-black dark:bg-zinc-900 dark:text-white" aria-label="Labels" />
            </div>
            <div>
              <label className="block text-xs opacity-70">Category</label>
              <select value={category} onChange={(e)=> setCategory(e.target.value)} className="rounded border bg-white text-black dark:bg-zinc-900 dark:text-white">
                <option value="">(keep)</option>
                {['pii','policy','prompt-injection','spam','abuse','hallucination','cost-anomaly','other'].map(c=> (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <button className="underline" aria-label={`Resolve ${id}`} onClick={()=> onAction(id,'resolved',{ note: note || undefined, labels: labelArr.length ? labelArr : undefined, category: category || undefined })}>Resolve</button>
            <button className="underline" aria-label={`Dismiss ${id}`} onClick={()=> onAction(id,'dismissed',{ note: note || undefined, labels: labelArr.length ? labelArr : undefined, category: category || undefined })}>Dismiss</button>
            <button className="underline" aria-label={`Escalate ${id}`} onClick={()=> onAction(id,'escalated',{ note: note || undefined, labels: labelArr.length ? labelArr : undefined, category: category || undefined })}>Escalate</button>
            <button className="underline" aria-label={`Reopen ${id}`} onClick={()=> onAction(id,'reopen',{ note: note || undefined, labels: labelArr.length ? labelArr : undefined, category: category || undefined })}>Reopen</button>
          </div>
          {data.notes && data.notes.length > 0 && (
            <div className="mt-4">
              <div className="text-xs opacity-70 mb-1">Notes</div>
              <ul className="list-disc pl-4 text-sm space-y-1">
                {data.notes.map((n,i)=> (<li key={i}>{n}</li>))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


