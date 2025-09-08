"use client";
import { getApiPath } from '@/lib/basepath';
import { useEffect, useState } from 'react';

type Item = { id: string; title: string; body: string };

export default function RecentAnswers() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        let journeyId: string | null = null;
        try { journeyId = localStorage.getItem('mxtkJourneyId'); } catch { }
        if (!journeyId) { if (!aborted) setItems([]); return; }
        const res = await fetch(getApiPath(`/api/ai/journey/${encodeURIComponent(journeyId)}`), { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } });
        const data = await res.json().catch(() => ({ ok: false }));
        if (!data?.ok) { if (!aborted) setItems([]); return; }
        const blocks = Array.isArray(data.journey?.blocks) ? data.journey.blocks : [];
        const recent = blocks.filter((b: any) => (b.body || '').trim()).slice(-5).reverse();
        if (!aborted) setItems(recent.map((b: any) => ({ id: b.id, title: b.title || 'Recent answer', body: b.body })));
      } catch {
        if (!aborted) setError('Could not load recent answers');
      }
    })();
    return () => { aborted = true; };
  }, []);

  if (error) return <div className="text-sm text-red-600 dark:text-red-400" role="status">{error}</div>;

  return (
    <div className="prose prose-sm widget-recent-answers">
      {!items.length && <p className="opacity-70">No recent answers yet.</p>}
      {items.map(m => (
        <article key={m.id} className="answer-card">
          <h4 className="m-0 font-medium">{m.title}</h4>
          <p>{m.body?.length > 800 ? m.body.slice(0, 800) + '…' : m.body}</p>
        </article>
      ))}
    </div>
  );
}


