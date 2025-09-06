"use client";
import { useEffect, useState } from 'react';

export default function FlagReview() {
  const [data, setData] = useState<any>({ pending: [], decided: [] });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    setErr('');
    try {
      const r = await fetch('/api/ai/flags', {
        headers: { authorization: 'Bearer ' + (process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'dev') },
      });
      const j = await r.json();
      if (!j.ok) throw new Error('auth');
      setData(j);
    } catch (e: any) {
      setErr(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function act(id: string, action: 'approve' | 'reject') {
    setBusy(true);
    await fetch('/api/ai/flags', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + (process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'dev'),
      },
      body: JSON.stringify({ id, action }),
    });
    setBusy(false);
    await load();
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section>
        <h2 className="font-semibold mb-2">Pending</h2>
        {data.pending.map((p: any) => (
          <div key={p.id} className="rounded-xl border p-3 mb-3 glass">
            <div className="text-xs opacity-70 mb-2">risk {p.risk} • {p.labels?.join(', ')}</div>
            <pre className="text-xs whitespace-pre-wrap max-h-48 overflow-auto">{JSON.stringify(p.meta, null, 2)}</pre>
            <div className="flex gap-2 mt-2">
              <button disabled={busy} className="btn btn-sm bg-green-600 text-white rounded" onClick={() => act(p.id, 'approve')}>Approve</button>
              <button disabled={busy} className="btn btn-sm bg-red-600 text-white rounded" onClick={() => act(p.id, 'reject')}>Reject</button>
            </div>
          </div>
        ))}
      </section>
      <section>
        <h2 className="font-semibold mb-2">Decided</h2>
        <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
          {data.decided.map((d: any) => (
            <div key={d.id + d.at} className="rounded-xl border p-3 glass">
              <div className="text-xs opacity-70 mb-2">{d.at} • {d.action}</div>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(d.meta, null, 2)}</pre>
            </div>
          ))}
        </div>
      </section>
      {err && <p className="text-red-600">{err}</p>}
    </div>
  );
}


