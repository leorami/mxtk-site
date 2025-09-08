"use client";
import { useEffect, useState } from 'react';
import { getBasePathUrl } from '../../lib/basepath';

function isAdminCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c.startsWith('mxtk_admin=1'));
}

export default function FactsEditor() {
  const [enabled, setEnabled] = useState(false);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<string>('');
  const [etag, setEtag] = useState<string>('');

  useEffect(() => {
    setEnabled(isAdminCookie());
    (async () => {
      try {
        const res = await fetch(getBasePathUrl('/api/ai/facts'));
        const json = await res.json();
        setValue(JSON.stringify(json.data, null, 2));
        setEtag(res.headers.get('etag') || '');
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  async function submit() {
    setStatus('');
    let parsed: any;
    try {
      parsed = JSON.parse(value);
    } catch (e: any) {
      setStatus('Invalid JSON');
      return;
    }
    try {
      const res = await fetch(getBasePathUrl('/api/ai/facts'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsed }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatus(`Error ${res.status}: ${JSON.stringify(err)}`);
        return;
      }
      const json = await res.json();
      setEtag(res.headers.get('etag') || '');
      setStatus(`Saved. version=${json.version} updatedAt=${new Date(json.updatedAt).toLocaleString()}`);
    } catch (e: any) {
      setStatus('Network error');
    }
  }

  return (
    <div data-testid="facts-editor" className="rounded-lg border border-neutral-300 dark:border-neutral-700 p-4 space-y-3 bg-[var(--surface-card,#ffffff)]/90 dark:bg-[var(--surface-card,#0b0e12)]/60">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-[var(--ink-strong,#0b0e12)] dark:text-[var(--ink-strong,#f8fafc)]">Facts Editor</h2>
        <span className="text-xs text-neutral-700 dark:text-neutral-300">ETag: {etag || '—'}</span>
      </div>
      {!enabled && (
        <div className="text-sm text-neutral-700 dark:text-neutral-300">Admin session not detected. You can view but not edit.</div>
      )}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-64 rounded-md border border-neutral-400 dark:border-neutral-600 bg-transparent p-2 font-mono text-sm text-[var(--ink,#0b0e12)] dark:text-[var(--ink,#f8fafc)]"
        spellCheck={false}
      />
      <div className="flex items-center gap-2">
        <button
          onClick={submit}
          disabled={!enabled}
          className="px-3 py-1 rounded-md border border-neutral-400 text-sm hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
        >
          Save
        </button>
        <span className="text-sm text-neutral-800 dark:text-neutral-200">{status}</span>
      </div>
    </div>
  );
}


