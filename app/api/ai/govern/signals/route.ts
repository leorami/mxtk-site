import { NextRequest, NextResponse } from 'next/server';
import { zSignal, recordSignal, getSignals } from '@/lib/ai/govern/signals';

export const runtime = 'nodejs';

function authed(req: NextRequest) {
  const t = req.headers.get('authorization') || '';
  const admin = process.env.ADMIN_TOKEN || 'dev';
  if (t === 'Bearer ' + admin) return true;
  const adminCookie = req.cookies.get('mxtk_admin')?.value;
  return adminCookie === '1';
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const body = await req.json().catch(() => ({}));
  const parsed = zSignal.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  const sig = await recordSignal(parsed.data);
  return NextResponse.json(sig, { headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const { searchParams } = new URL(req.url);
  const since = searchParams.get('since');
  const limit = searchParams.get('limit');
  const { items } = await getSignals({ since: since ? Number(since) : undefined, limit: limit ? Number(limit) : undefined });
  return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } });
}


