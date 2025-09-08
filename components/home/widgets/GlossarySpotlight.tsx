"use client";
import { useEffect, useState } from 'react';

type GlossaryTerm = { term: string; definition: string; href?: string };

// Local fallback glossary terms
const LOCAL: GlossaryTerm[] = [
  { term: 'Attestation', definition: 'A signed statement by validators attesting to data correctness.', href: '/transparency' },
  { term: 'Oracle', definition: 'A service that publishes signed updates of real-world data on-chain.', href: '/transparency' },
  { term: 'Custody', definition: 'The policies and processes for key management and asset control.' },
];

export default function GlossarySpotlight() {
  const [pick, setPick] = useState<GlossaryTerm | null>(null);

  useEffect(() => {
    try {
      const existing = sessionStorage.getItem('mxtk_glossary_spotlight');
      if (existing) {
        setPick(JSON.parse(existing));
        return;
      }
    } catch { }

    // No remote glossary API yet; pick from local for now (once per session)
    const idx = Math.floor(Math.random() * LOCAL.length);
    const chosen = LOCAL[idx];
    setPick(chosen);
    try { sessionStorage.setItem('mxtk_glossary_spotlight', JSON.stringify(chosen)); } catch { }
  }, []);

  if (!pick) return <div className="text-sm opacity-70">Loading…</div>;

  return (
    <div className="text-sm leading-relaxed">
      <div className="font-semibold mb-1">{pick.term}</div>
      <p className="opacity-90">{pick.definition}</p>
      {pick.href && (
        <p className="mt-2">
          <a className="underline" href={pick.href}>Learn more</a>
        </p>
      )}
    </div>
  );
}


