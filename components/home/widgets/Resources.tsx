"use client";
import { getApiPath } from '@/lib/basepath';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Resource = { label: string; href: string; prompt?: string };

function buildResourceList(): Resource[] {
  // Curate from copy; keep it static/deterministic
  const core: Resource[] = [
    { label: 'Resources', href: '/resources', prompt: 'Open the MXTK Resources overview, list its sections, give 3 key takeaways, and suggest the next best link for a builder.' },
    { label: 'Whitepaper', href: '/whitepaper', prompt: 'Summarize the MXTK whitepaper' },
    { label: 'Transparency', href: '/transparency', prompt: 'Explain MXTK transparency proofs' },
    { label: 'FAQ', href: '/faq', prompt: 'Answer common MXTK questions' },
    { label: 'Roadmap', href: '/roadmap', prompt: 'Discuss the MXTK roadmap' },
  ];
  return core;
}

function getHomeId(): string {
  try {
    const m = document.cookie.match(/(?:^|; )mxtk_home_id=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : 'default';
  } catch { return 'default'; }
}

export default function Resources({ id, data }: { id?: string; data?: { maxItems?: number } }) {
  const links = useMemo(() => buildResourceList(), []);
  const maxItems = Math.max(1, Math.min(links.length, Number(data?.maxItems ?? 7)));
  const [currentMax, setCurrentMax] = useState<number>(maxItems);
  useEffect(() => { setCurrentMax(maxItems); }, [maxItems]);

  const persist = useCallback(async (next: number) => {
    if (!id) return;
    const homeId = getHomeId();
    try {
      await fetch(getApiPath(`/api/ai/home/${encodeURIComponent(homeId)}`), {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ widgets: [{ id, data: { maxItems: next } }] }),
      });
    } catch { }
  }, [id]);

  const onLearnMore = useCallback((r: Resource) => {
    try {
      fetch(getApiPath('/api/ai/signals'), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: `sig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`, ts: Date.now(), kind: 'open', docId: getHomeId(), meta: { target: 'guide', intent: 'prefill', source: 'resources', href: r.href } }), cache: 'no-store'
      }).catch(() => {})
      const prompt = r.prompt || [
        'Open the MXTK Resources overview and briefly describe its sections.',
        'Then give: 3 key takeaways, and the next best link a builder should click.',
        'Respond in ~6 bullets, no fluff.'
      ].join(' ');
      window.dispatchEvent(new CustomEvent('mxtk:guide:open', {
        detail: { prompt, send: true }
      }));
    } catch { }
  }, []);

  // Persist a changed maxItems if caller updates data; settings gear will write via PATCH
  // This component simply respects `data.maxItems`.

  return (
    <div className="text-sm leading-relaxed">
      {/* settings controls; auto-hidden by CSS unless guide is open */}
      <div className="widget-controls mb-2 inline-flex items-center gap-2" aria-hidden="true">
        <span className="opacity-70">Max items</span>
        <div className="inline-flex items-center gap-1">
          <button className="iconbtn" aria-label="Decrease items" onClick={() => { const n = Math.max(3, currentMax - 1); setCurrentMax(n); persist(n); }}>–</button>
          <span className="min-w-[1.5rem] text-center tabular-nums" aria-live="polite">{currentMax}</span>
          <button className="iconbtn" aria-label="Increase items" onClick={() => { const n = Math.min(7, currentMax + 1); setCurrentMax(n); persist(n); }}>+</button>
        </div>
      </div>
      <ul className="space-y-1">
        {links.slice(0, currentMax).map((r) => (
          <li key={r.href} className="flex items-center justify-between gap-2">
            <a className="underline" href={r.href}>{r.label}</a>
            <button
              className="btn-link text-sm"
              onClick={() => onLearnMore(r)}
              aria-label={`Learn more about ${r.label}`}
              data-nodrag
            >Learn more</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const meta = {
  id: 'resources',
  stages: ['training','preparing','conquer'],
  priority: 0.7,
  mobileFriendly: true,
  categories: ['Resources'],
} as const


