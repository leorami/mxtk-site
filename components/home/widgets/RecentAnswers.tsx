"use client";
import { getApiPath } from '@/lib/basepath';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Item = { id: string; title: string; body: string };

export default function RecentAnswers({ refreshToken = 0 }: { refreshToken?: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const journeyId = useMemo(() => {
    try { return localStorage.getItem('mxtkJourneyId'); } catch { return null; }
  }, [refreshToken]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!journeyId) { setItems([]); return; }
      const res = await fetch(getApiPath(`/api/ai/journey/${encodeURIComponent(journeyId)}`), { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!data?.ok) { setItems([]); return; }
      const blocks = Array.isArray(data.journey?.blocks) ? data.journey.blocks : [];
      const recent = blocks
        .filter((b: any) => (b?.body || '').trim())
        .slice(-5)
        .reverse();
      setItems(recent.map((b: any) => ({ id: b.id, title: b.title || 'Recent answer', body: String(b.body || '') })));
    } catch {
      setError('Could not load recent answers');
    } finally {
      setLoading(false);
    }
  }, [journeyId]);

  useEffect(() => {
    let alive = true;
    (async () => { await load(); })();
    return () => { alive = false; };
  }, [load, refreshToken]);

  if (error) return <div className="text-sm text-red-600 dark:text-red-400" role="status">{error}</div>;

  return (
    <div className="prose prose-sm widget-recent-answers">
      {loading && items.length === 0 && (
        <p className="opacity-70">Loading…</p>
      )}
      {!loading && items.length === 0 && (
        <p className="opacity-70">No recent answers yet.</p>
      )}
      {items.map(m => (
        <article key={m.id} className="answer-card">
          <h4 className="m-0 font-medium">
            <button
              className="btn-link text-sm"
              onClick={() => {
                try {
                  // log open signal
                  fetch(getApiPath('/api/ai/signals'), {
                    method: 'POST', headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ id: `sig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`, ts: Date.now(), kind: 'open', docId: 'default', meta: { target: 'guide', intent: 'prefill', source: 'recent-answers' } }), cache: 'no-store'
                  }).catch(() => {})
                  window.dispatchEvent(new CustomEvent('mxtk:guide:prefill', { detail: { prompt: m.title || m.body?.slice(0, 120) } }));
                } catch {}
              }}
            >{m.title}</button>
          </h4>
          <p>{m.body?.length > 160 ? m.body.slice(0, 160) + '…' : m.body}</p>
        </article>
      ))}
    </div>
  );
}


