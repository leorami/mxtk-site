"use client";
import { useEffect, useState } from 'react';

type GlossaryTerm = { term: string; definition: string };

export default function GlossarySpotlight() {
  const [items, setItems] = useState<GlossaryTerm[]>([]);

  useEffect(() => {
    let aborted = false;

    // Use mock data instead of trying to fetch from a non-existent endpoint
    const mockItems = [
      { term: "Mineral Token", definition: "A digital asset that represents ownership of verified mineral reserves." },
      { term: "Oracle", definition: "A trusted data source that provides real-world information to blockchain applications." },
      { term: "Validator", definition: "An entity that verifies transactions and maintains the integrity of the network." },
      { term: "Provenance", definition: "The documented history of ownership and origin of an asset." },
      { term: "Governance", definition: "The system of rules and processes that determine how decisions are made." }
    ];

    // Set mock items after a short delay to simulate network request
    setTimeout(() => {
      if (!aborted) setItems(mockItems);
    }, 100);

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


