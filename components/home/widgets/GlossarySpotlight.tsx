"use client";
import { getApiPath } from '@/lib/basepath';
import { useCallback, useEffect, useMemo } from 'react';

type GlossaryTerm = { term: string; definition: string };

const TERMS: GlossaryTerm[] = [
  { term: 'Mineral Token', definition: 'A digital asset that represents ownership of verified mineral reserves.' },
  { term: 'Oracle', definition: 'A trusted data source that provides real-world information to blockchain applications.' },
  { term: 'Validator', definition: 'An entity that verifies transactions and maintains the integrity of the network.' },
  { term: 'Provenance', definition: 'The documented history of ownership and origin of an asset.' },
  { term: 'Governance', definition: 'The system of rules and processes that determine how decisions are made.' }
];

function yyyymmddUTC(d = new Date()) {
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

function hashString(input: string): number {
  // Simple djb2
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h) + input.charCodeAt(i);
  return Math.abs(h >>> 0);
}

function getHomeId(): string {
  try {
    const m = document.cookie.match(/(?:^|; )mxtk_home_id=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : 'default';
  } catch { return 'default'; }
}

export default function GlossarySpotlight({ id, data }: { id?: string; data?: { day?: string; index?: number } }) {
  const today = useMemo(() => yyyymmddUTC(), []);
  const list = TERMS; // static

  // Determine selected index
  const computedIndex = useMemo(() => {
    const seed = today;
    const idx = hashString(seed) % list.length;
    return idx;
  }, [today, list.length]);

  const pickIndex = (typeof data?.index === 'number' && data?.day === today)
    ? Math.max(0, Math.min(list.length - 1, data!.index!))
    : computedIndex;
  const pick = list[pickIndex];

  // Persist today/index to avoid flicker on reloads
  useEffect(() => {
    if (!id) return;
    if (data?.day === today && typeof data?.index === 'number') return;
    const homeId = getHomeId();
    (async () => {
      try {
        await fetch(getApiPath(`/api/ai/home/${encodeURIComponent(homeId)}`), {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ widgets: [{ id, data: { day: today, index: pickIndex } }] })
        });
      } catch { }
    })();
  }, [id, data?.day, data?.index, today, pickIndex]);

  const onLearn = useCallback(() => {
    try {
      fetch(getApiPath('/api/ai/signals'), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: `sig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`, ts: Date.now(), kind: 'open', docId: getHomeId(), meta: { target: 'guide', intent: 'prefill', source: 'glossary-spotlight', term: pick.term } }), cache: 'no-store'
      }).catch(() => {})
      const prompt = `Explain ${pick.term} and how it relates to MXTK. Provide a brief summary and key points.`
      window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: { prompt, send: true } }));
    } catch { }
  }, [pick.term]);

  return (
    <div className="text-sm leading-relaxed">
      <div className="font-semibold mb-1">{pick.term}</div>
      <p className="opacity-90">{pick.definition}</p>
      <button className="btn-link text-sm mt-2" onClick={onLearn} aria-label="Learn more in Guide" data-nodrag>Learn</button>
    </div>
  );
}


