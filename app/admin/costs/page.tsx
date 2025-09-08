import { headers } from 'next/headers';
import fs from 'node:fs/promises';
import path from 'node:path';
import 'server-only';

export const dynamic = 'force-dynamic';

async function getDaily() {
  const base = process.env.AI_VECTOR_DIR || './ai_store';
  try {
    const d = JSON.parse(await fs.readFile(path.join(process.cwd(), base, 'costs_daily.json'), 'utf8')) as Record<string, { usd: number; calls?: number }>;
    return d;
  } catch {
    return {} as Record<string, { usd: number; calls?: number }>;
  }
}

async function getRecentLines(limit = 50) {
  const base = process.env.AI_VECTOR_DIR || './ai_store';
  try {
    const txt = await fs.readFile(path.join(process.cwd(), base, 'costs.jsonl'), 'utf8');
    const lines = txt.trim() ? txt.trim().split(/\n+/) : [];
    return lines.slice(-limit).map((l) => {
      try { return JSON.parse(l); } catch { return null; }
    }).filter(Boolean);
  } catch {
    return [] as any[];
  }
}

async function authed(): Promise<boolean> {
  const h = await headers();
  const t = h.get('authorization') || '';
  const admin = process.env.ADMIN_TOKEN || 'dev';
  return t === 'Bearer ' + admin;
}

export default async function Page() {
  if (!(await authed())) {
    return <div className="max-w-3xl mx-auto p-6"><h1 className="text-xl font-semibold">Unauthorized</h1><p className="opacity-70">Missing or invalid ADMIN_TOKEN.</p></div>;
  }
  const daily = await getDaily();
  const rows = Object.entries(daily).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  const recent = await getRecentLines(30);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">AI Cost Summary</h1>
      <table className="w-full text-sm mb-6">
        <thead><tr><th className="text-left">Date</th><th className="text-right">USD</th><th className="text-right">Calls</th></tr></thead>
        <tbody>{rows.map(([d, v]: any) => (<tr key={d}><td>{d}</td><td className="text-right">${(v.usd || 0).toFixed(4)}</td><td className="text-right">{v.calls || '-'}</td></tr>))}</tbody>
      </table>
      <h2 className="text-xl font-semibold mb-2">Recent Calls</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr><th className="text-left">Time</th><th>Kind</th><th>Model</th><th>Tier</th><th className="text-right">In</th><th className="text-right">Out</th><th className="text-right">USD</th><th>Route</th></tr></thead>
          <tbody>
            {recent.map((r: any, i: number) => (
              <tr key={i}>
                <td>{(r.ts || '').replace('T', ' ').slice(0, 19)}</td>
                <td>{r.kind}</td>
                <td>{r.model}</td>
                <td>{r.tier || '-'}</td>
                <td className="text-right">{r.tokens?.in ?? '-'}</td>
                <td className="text-right">{r.tokens?.out ?? '-'}</td>
                <td className="text-right">${Number(r.usd || 0).toFixed(4)}</td>
                <td className="truncate max-w-[200px]">{r.route || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


