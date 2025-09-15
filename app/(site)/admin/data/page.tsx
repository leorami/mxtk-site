'use client';
import { withBase } from '@/lib/basepath';
import * as React from 'react';

export default function AdminData() {
  const [diag, setDiag] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const r = await fetch(withBase('/api/data/_diag'), { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      setDiag(await r.json());
    } catch (e: any) {
      setError('Forbidden or unavailable');
      setDiag(null);
    }
  }
  async function warm() {
    setError(null);
    try {
      await fetch(withBase('/api/data/_warm'), { method: 'POST' });
      await load();
    } catch (e: any) {
      setError('Warm failed');
    }
  }
  React.useEffect(() => { load(); }, []);

  return (
    <main className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Data cache</h1>
      <div className="flex items-center gap-2">
        <button className="btn" onClick={warm}>Warm now</button>
        <button className="btn" onClick={load}>Reload</button>
      </div>
      {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
      <pre className="mt-4 p-3 rounded bg-black/20 text-xs overflow-auto">{JSON.stringify(diag, null, 2)}</pre>
    </main>
  );
}


