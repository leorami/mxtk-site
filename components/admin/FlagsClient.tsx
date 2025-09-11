"use client";
import FlagDetailPanel from '@/components/admin/FlagDetailPanel';
import { getApiUrl } from '@/lib/api';
import { useEffect, useState } from 'react';

type IndexItem = {
  id: string;
  createdAt: number;
  updatedAt?: number;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed' | 'escalated';
  category?: string;
  severity?: 1 | 2 | 3;
  journeyId?: string;
  messageId?: string;
  reason: string;
  labels?: string[];
};

type Props = { initialQuery?: { status?: IndexItem['status']; category?: string; q?: string } };

export default function FlagsClient({ initialQuery }: Props) {
  const [status, setStatus] = useState(initialQuery?.status || 'open');
  const [category, setCategory] = useState(initialQuery?.category || '');
  const [q, setQ] = useState(initialQuery?.q || '');
  const [items, setItems] = useState<IndexItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  async function load(cursor?: string) {
    setErr('');
    const sp = new URLSearchParams();
    if (status) sp.set('status', status);
    if (category) sp.set('category', category);
    if (q) sp.set('q', q);
    if (cursor) sp.set('cursor', cursor);
    const r = await fetch(getApiUrl('/ai/flags') + '?' + sp.toString(), { headers: { 'cache-control': 'no-store' } });
    if (!r.ok) {
      setErr('Failed to load');
      return;
    }
    const j = await r.json();
    setItems(cursor ? [...items, ...j.items] : j.items);
    setNextCursor(j.nextCursor);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, category, q]);

  async function act(id: string, action: IndexItem['status'] | 'reopen', payload?: { note?: string; labels?: string[]; category?: string }) {
    setBusy(true);
    try {
      const body = {
        id: crypto.randomUUID(),
        flagId: id,
        at: Date.now(),
        actor: 'admin',
        action: action === 'resolved' ? 'resolve' : action === 'dismissed' ? 'dismiss' : action === 'escalated' ? 'escalate' : action === 'reopen' ? 'reopen' : 'annotate',
        payload,
      };
      const r = await fetch(getApiUrl(`/ai/flags/${id}`), { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error('Update failed');
      const updated = await r.json();
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...updated } : it)));
      // record signal
      const ls = payload?.labels && payload.labels.length ? payload.labels : (updated.labels || []);
      const labelSet = ls && ls.length ? ls : [body.action];
      await fetch(getApiUrl('/ai/govern/signals'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ flagId: id, at: Date.now(), labelSet, category: updated.category, severity: updated.severity, note: payload?.note, journeyId: updated.journeyId, messageId: updated.messageId }) });
    } catch (e: any) {
      setErr(e.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4" data-testid="flags-client">
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-xs opacity-70">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded border bg-white text-black dark:bg-zinc-900 dark:text-white">
            {['open','reviewing','resolved','dismissed','escalated'].map((s)=> (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs opacity-70">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded border bg-white text-black dark:bg-zinc-900 dark:text-white">
            <option value="">(any)</option>
            {['pii','policy','prompt-injection','spam','abuse','hallucination','cost-anomaly','other'].map((c)=> (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs opacity-70">Search</label>
          <input value={q} onChange={(e)=> setQ(e.target.value)} className="w-full rounded border px-2 py-1 bg-white text-black dark:bg-zinc-900 dark:text-white" placeholder="reason contains…" aria-label="Search flags" />
        </div>
      </div>

      {err && <p className="text-red-600" role="alert">{err}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2 pr-3">Created</th>
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">Reason</th>
              <th className="py-2 pr-3">Severity</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="py-2 pr-3 opacity-80">{new Date(it.createdAt).toLocaleString()}</td>
                <td className="py-2 pr-3">{it.category || '-'}</td>
                <td className="py-2 pr-3 max-w-[360px] truncate" title={it.reason}>{it.reason}</td>
                <td className="py-2 pr-3">{it.severity || '-'}</td>
                <td className="py-2 pr-3">{it.status}</td>
                <td className="py-2 pr-3 whitespace-nowrap">
                  <button className="underline mr-2" aria-label={`Resolve ${it.id}`} onClick={()=> act(it.id,'resolved')}>Resolve</button>
                  <button className="underline mr-2" aria-label={`Dismiss ${it.id}`} onClick={()=> act(it.id,'dismissed')}>Dismiss</button>
                  <button className="underline mr-2" aria-label={`Escalate ${it.id}`} onClick={()=> act(it.id,'escalated')}>Escalate</button>
                  <button className="underline" aria-label={`View ${it.id}`} onClick={()=> setOpenId(openId===it.id? null : it.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {nextCursor && (
        <button disabled={busy} className="underline" onClick={()=> load(nextCursor)} aria-label="Load more flags">Load more</button>
      )}

      {openId && (
        <FlagDetailPanel id={openId} onClose={()=> setOpenId(null)} onAction={act} />
      )}
    </div>
  );
}


