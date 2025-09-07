import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function isSecure(req: NextRequest) {
  const proto = req.headers.get('x-forwarded-proto') || '';
  return proto === 'https';
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const token = (body && body.token) || '';
  const expected = process.env.MXTK_ADMIN_TOKEN || '';
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  const res = NextResponse.json({}, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  res.cookies.set('mxtk_admin', '1', {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: isSecure(req),
  });
  return res;
}

export async function GET(req: NextRequest) {
  const has = req.cookies.get('mxtk_admin')?.value === '1';
  return NextResponse.json({ ok: has }, { status: has ? 200 : 401, headers: { 'Cache-Control': 'no-store' } });
}


