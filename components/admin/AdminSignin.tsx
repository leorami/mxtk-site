"use client";
import { useState } from 'react';

export default function AdminSignin() {
  const [token, setToken] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const r = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!r.ok) throw new Error('Unauthorized');
      // refresh
      window.location.reload();
    } catch (e: any) {
      setErr(e.message || 'Failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-3">
      <label className="block text-sm">Admin token</label>
      <input
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full rounded border px-3 py-2 bg-white text-black dark:bg-zinc-900 dark:text-white"
        aria-label="Admin token"
      />
      <button disabled={busy} className="btn rounded bg-black text-white dark:bg-white dark:text-black px-3 py-2" aria-label="Sign in as admin">
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      {err && <p className="text-red-600 text-sm" role="alert">{err}</p>}
    </form>
  );
}


