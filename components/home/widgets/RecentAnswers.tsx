"use client";
import { getApiPath } from '@/lib/basepath';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type JourneyDoc = { id: string; blocks?: { id: string; title?: string; body: string; citations?: string[] }[] };

export default function RecentAnswers() {
  const [items, setItems] = useState<Array<{ id: string; title: string; body: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        let journeyId: string | null = null;
        try { journeyId = localStorage.getItem('mxtkJourneyId'); } catch { }
        if (!journeyId) { setItems([]); return; }
        const res = await fetch(getApiPath(`/api/ai/journey/${encodeURIComponent(journeyId)}`), { cache: 'no-store' });
        const data = await res.json().catch(() => ({ ok: false }));
        if (!data?.ok) { if (!aborted) setItems([]); return; }
        const doc: JourneyDoc = data.journey || { id: journeyId, blocks: [] };
        const blocks = Array.isArray(doc.blocks) ? doc.blocks : [];
        const recent = blocks.slice(-10).reverse().filter(b => (b.body || '').trim()).slice(0, 3);
        if (!aborted) {
          setItems(recent.map(b => ({ id: b.id, title: b.title || 'Recent answer', body: b.body })));
        }
      } catch (e: any) {
        if (!aborted) setError('Could not load recent answers');
      }
    })();
    return () => { aborted = true; };
  }, []);

  if (error) {
    return <div className="text-sm text-red-600 dark:text-red-400" role="status">{error}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-sm leading-relaxed">
        <ul className="space-y-2">
          <li className="opacity-70">No recent answers yet. Ask Sherpa to get started.</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="text-sm leading-relaxed">
      <ul className="space-y-3">
        {items.map(i => (
          <li key={i.id} className="p-2 rounded-lg bg-white/60 dark:bg-white/10 border border-black/5 dark:border-white/10">
            <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">{i.title}</div>
            <div className="prose prose-sm dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {i.body.length > 800 ? i.body.slice(0, 800) + '…' : i.body}
              </ReactMarkdown>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


