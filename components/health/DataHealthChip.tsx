'use client';
import { getApiPath } from '@/lib/basepath';
import { FRESHNESS, freshness } from '@/lib/data/policy';
import * as React from 'react';

export default function DataHealthChip() {
  const [state, setState] = React.useState<'fresh' | 'stale' | 'degraded'>('fresh');
  const [ageLabel, setAgeLabel] = React.useState<string>('');

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(getApiPath('/api/data/prices/MXTK?days=30'), { cache: 'no-store' });
        if (!res.ok) return;
        const j = await res.json();
        // Prefer envelope updatedAt; fall back to series end
        let updatedAt: number = j?.updatedAt || j?.data?.series?.end || Date.now();
        // Normalize seconds → milliseconds
        if (updatedAt && updatedAt < 1e12) updatedAt = updatedAt * 1000;
        const s = freshness(updatedAt, FRESHNESS.prices.warnMs);
        if (alive) {
          setState(s);
          setAgeLabel(formatAge(Date.now() - updatedAt));
        }
      } catch {}
    })();
    return () => { alive = false };
  }, []);

  const cls = state === 'fresh' ? 'bg-green-300' : state === 'stale' ? 'bg-amber-300' : 'bg-red-300';
  return (
    <span
      data-testid="data-health"
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${cls}`}
      aria-label={`Data health ${state}`}
    >
      Data {state} · {ageLabel}
    </span>
  );
}

function formatAge(deltaMs: number): string {
  const ms = Math.max(0, Math.floor(deltaMs || 0));
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo`;
  const y = Math.floor(d / 365);
  return `${y}y`;
}


