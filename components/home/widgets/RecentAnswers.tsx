"use client";
import { getApiPath } from '@/lib/basepath';
import { stripMarkdown } from '@/lib/utils/text';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Item = { id: string; title: string; body: string, question?: string };

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
      // Use the journey block title as the user's question (when available)
      setItems(recent.map((b: any) => ({ id: b.id, title: b.title || 'Recent question', body: String(b.body || ''), question: b.title })));
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

  // Refresh when journey updates
  useEffect(() => {
    function onJourney() { load(); }
    window.addEventListener('mxtk:journey:updated', onJourney as any);
    return () => window.removeEventListener('mxtk:journey:updated', onJourney as any);
  }, [load]);

  if (error) return <div className="text-sm text-red-600 dark:text-red-400" role="status">{error}</div>;

  return (
    <div className="p-2">
      <div>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.12)] ">
          <div className="text-fuchsia-600">
            <i className="fa-solid fa-comments text-2xl" aria-hidden="true"></i>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Recent Answers</h3>
        <div className="text-muted text-sm">
          <div className="widget-recent-answers text-left">
            {loading && items.length === 0 && (
              <div className="opacity-70 text-sm">Loading…</div>
            )}
            {!loading && items.length === 0 && (
              <div className="opacity-70 text-sm">No recent answers yet...</div>
            )}
            <ul className="space-y-2">
              {items.map(m => (
                <li key={m.id} className="answer-card">
                  <div className="rounded-lg px-3 py-2 bg-amber-300/20 text-amber-900 dark:text-amber-200 line-clamp-5">
                    {m.question || m.title || (m.body?.slice(0, 180) || '')}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {stripMarkdown(m.body)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export const meta = {
  id: 'recent-answers',
  stages: ['training'],
  priority: 0.6,
  mobileFriendly: true,
  categories: ['Resources'],
} as const


