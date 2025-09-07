import { appendReview, createFlag, getDecided, getFlag, getFlags, getPending, setDecided, setPending } from '@/lib/ai/govern/store';
import { safeParseQuery, zReviewAction } from '@/lib/ai/govern/schema';
import { getEmbedder } from '@/lib/ai/models';
import { estimateUSD, logCost } from '@/lib/ai/ops/costs';
import { loadVectorStore, saveVectorStore } from '@/lib/ai/vector-store';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

const base = process.env.AI_VECTOR_DIR || './ai_store';
const fb = path.join(process.cwd(), base, 'flags_feedback.json');

function authed(req: NextRequest) {
  const t = req.headers.get('authorization') || '';
  const admin = process.env.ADMIN_TOKEN || 'dev';
  if (t === 'Bearer ' + admin) return true;
  const adminCookie = req.cookies.get('mxtk_admin')?.value;
  return adminCookie === '1';
}

export async function GET(req: NextRequest) {
  // If query params for new governance listing are present, use them; else legacy response
  const { searchParams } = new URL(req.url);
  const qp: Record<string, string> = {};
  for (const [k, v] of searchParams.entries()) qp[k] = v;
  const hasGovernQuery = ['status', 'category', 'q', 'limit', 'cursor'].some((k) => k in qp);

  if (hasGovernQuery) {
    if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    const parsed = safeParseQuery({
      status: qp.status,
      category: qp.category,
      q: qp.q,
      limit: qp.limit ? Number(qp.limit) : undefined,
      cursor: qp.cursor,
    });
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'invalid query' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    const { items, nextCursor } = await getFlags(parsed.data as any);
    return NextResponse.json({ items, nextCursor }, { headers: { 'Cache-Control': 'no-store' } });
  }

  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const [p, d] = await Promise.all([getPending(), getDecided()]);
  return NextResponse.json({ ok: true, pending: p, decided: d }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const body = await req.json().catch(() => ({}));
  const { id, action, notes } = body || {};
  if (!id || !action) return NextResponse.json({ ok: false }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  const p = await getPending();
  const i = p.findIndex((x: any) => x.id === id);
  if (i < 0) return NextResponse.json({ ok: false }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  const item = p.splice(i, 1)[0];
  const d = await getDecided();
  d.unshift({ ...item, action, notes, at: new Date().toISOString() });
  await Promise.all([setPending(p), setDecided(d)]);

  // If approved, embed the chunk and update store
  if (action === 'approve') {
    const store = await loadVectorStore();
    const idx = store.chunks.findIndex((c) => c.id === item.id);
    if (idx >= 0) {
      const embedder = getEmbedder() as any;
      const [vec] = await embedder.embed([store.chunks[idx].text]);
      const inTok = Math.ceil((store.chunks[idx].text || '').length / 4);
      const usd = estimateUSD(inTok, 0, embedder.pricing);
      await logCost({ ts: new Date().toISOString(), kind: 'embed', model: embedder.name, tier: undefined, tokens: { in: inTok, out: 0 }, usd, route: '/api/ai/flags' });
      store.chunks[idx].quarantined = false;
      store.embeddings[idx] = vec;
      await saveVectorStore(store);
    }
  }

  // feedback
  let fbj: { pos: string[]; neg: string[] } = { pos: [], neg: [] };
  try {
    fbj = JSON.parse(await fs.readFile(fb, 'utf8')) as { pos: string[]; neg: string[] };
  } catch {}
  const terms = (item.reasons || [])
    .join(' ')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .slice(0, 20);
  if (action === 'approve') {
    fbj.neg = [...new Set([...(fbj.neg || []), ...terms])];
  } else {
    fbj.pos = [...new Set([...(fbj.pos || []), ...terms])];
  }
  await fs.writeFile(fb, JSON.stringify(fbj, null, 2), 'utf8');
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}


