import { NextRequest, NextResponse } from 'next/server';
import { appendReview, getFlag, putFlag } from '@/lib/ai/govern/store';
import { zReviewAction } from '@/lib/ai/govern/schema';

export const runtime = 'nodejs';

function authed(req: NextRequest) {
  const t = req.headers.get('authorization') || '';
  const admin = process.env.ADMIN_TOKEN || 'dev';
  if (t === 'Bearer ' + admin) return true;
  const adminCookie = req.cookies.get('mxtk_admin')?.value;
  return adminCookie === '1';
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const flag = await getFlag(params.id);
  if (!flag) return NextResponse.json({ ok: false }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  return NextResponse.json(flag, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const body = await req.json().catch(() => ({}));
  const parsed = zReviewAction.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid payload' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

  const existing = await getFlag(params.id);
  if (!existing) return NextResponse.json({ ok: false }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

  const ev = parsed.data;
  if (ev.flagId !== params.id) return NextResponse.json({ ok: false }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  await appendReview(ev);

  const now = Date.now();
  let status = existing.status;
  if (ev.action === 'resolve') status = 'resolved';
  else if (ev.action === 'dismiss') status = 'dismissed';
  else if (ev.action === 'escalate') status = 'escalated';
  else if (ev.action === 'reopen') status = 'open';

  const updated = {
    ...existing,
    status,
    updatedAt: now,
    category: ev.payload?.category ?? existing.category,
    labels: ev.payload?.labels ?? existing.labels,
    notes: ev.payload?.note ? [...(existing.notes || []), ev.payload.note] : existing.notes,
  };
  await putFlag(updated);
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
}


