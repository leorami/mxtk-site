"use client";
import { getApiPath } from '@/lib/basepath';
import { useEffect, useState } from 'react';

type GlossaryTerm = { term: string; definition: string };

export default function GlossarySpotlight() {
  const [items, setItems] = useState<GlossaryTerm[]>([]);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch(getApiPath('/api/ai/glossary'), { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } });
        if (!res.ok) { if (!aborted) setItems([]); return; }
        const data = await res.json();
        if (!aborted) setItems(Array.isArray(data.items) ? data.items : []);
      } catch { if (!aborted) setItems([]); }
    })();
    return () => { aborted = true; };
  }, []);

  if (!items.length) return <p className="opacity-70">No glossary data yet.</p>;
  const day = Math.floor(Date.now() / 86400000);
  const pick = items[day % items.length];
  return (
    <div className="text-sm leading-relaxed">
      <div className="font-semibold mb-1">{pick.term}</div>
      <p className="opacity-90">{pick.definition}</p>
      <button
        className="underline mt-2"
        onClick={() => { try { window.dispatchEvent(new CustomEvent('mxtk:guide:prefill', { detail: { prompt: `Explain ${pick.term} as it relates to MXTK` } })) } catch { } }}
        aria-label="Learn more in Guide"
      >Learn more…</button>
    </div>
  );
}


