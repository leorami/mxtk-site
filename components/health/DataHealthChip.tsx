'use client';
import { getApiPath } from '@/lib/basepath';
import { FRESHNESS, freshness, minutesAgo } from '@/lib/data/policy';
import * as React from 'react';

export default function DataHealthChip() {
  const [state, setState] = React.useState<'fresh' | 'stale' | 'degraded'>('fresh');
  const [age, setAge] = React.useState<number>(0);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(getApiPath('/api/data/prices/MXTK?days=30'), { cache: 'no-store' });
        if (!res.ok) return;
        const j = await res.json();
        const updatedAt = j?.data?.series?.end || j?.updatedAt || Date.now();
        const s = freshness(updatedAt, FRESHNESS.prices.warnMs);
        if (alive) {
          setState(s);
          setAge(minutesAgo(updatedAt));
        }
      } catch {}
    })();
    return () => { alive = false };
  }, []);

  const cls = state === 'fresh' ? 'bg-green-500' : state === 'stale' ? 'bg-amber-500' : 'bg-red-500';
  return (
    <span
      data-testid="data-health"
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${cls}`}
      aria-label={`Data health ${state}`}
    >
      Data {state} · {age}m
    </span>
  );
}


