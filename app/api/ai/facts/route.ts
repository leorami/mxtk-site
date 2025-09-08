import { NextRequest, NextResponse } from 'next/server';
import { getFacts, computeEtag, putFacts, bumpVersion } from '../../../../lib/facts/store';
import { zFactsData, sanitizeFacts } from '../../../../lib/facts/schema';
import type { FactsDoc } from '../../../../lib/facts/types';

export const runtime = 'nodejs';

function cacheHeaders(etag: string) {
  return {
    ETag: etag,
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    'Content-Type': 'application/json; charset=utf-8',
  } as Record<string, string>;
}

export async function GET(req: NextRequest) {
  const doc = await getFacts();
  const etag = computeEtag(doc);
  const inm = req.headers.get('if-none-match');
  if (inm && inm === etag) {
    return new NextResponse(null, { status: 304, headers: cacheHeaders(etag) });
  }
  return NextResponse.json(doc, { status: 200, headers: cacheHeaders(etag) });
}

export async function HEAD(req: NextRequest) {
  const doc = await getFacts();
  const etag = computeEtag(doc);
  const inm = req.headers.get('if-none-match');
  if (inm && inm === etag) {
    return new NextResponse(null, { status: 304, headers: cacheHeaders(etag) });
  }
  return new NextResponse(null, { status: 200, headers: cacheHeaders(etag) });
}

function isAdmin(req: NextRequest): boolean {
  const cookieOk = req.cookies.get('mxtk_admin')?.value === '1';
  const token = req.headers.get('x-admin-token')?.trim() || '';
  const expected = (process.env.MXTK_ADMIN_TOKEN || process.env.ADMIN_TOKEN || process.env.NEXT_PUBLIC_ADMIN_TOKEN || '').trim();
  const tokenOk = !!expected && token === expected;
  return cookieOk || tokenOk;
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  const body = await req.json().catch(() => ({}));
  const dataParse = zFactsData.safeParse(body?.data);
  if (!dataParse.success) {
    return NextResponse.json({ ok: false, error: dataParse.error.flatten() }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
  const current = await getFacts();
  const next: FactsDoc = bumpVersion({ ...current, data: dataParse.data });
  await putFacts(next);
  const etag = computeEtag(next);
  return NextResponse.json(next, { status: 200, headers: { ETag: etag, 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' } });
}

function deepMerge<T>(target: T, source: Partial<T>): T {
  if (source == null || typeof source !== 'object') return target;
  const out: any = Array.isArray(target) ? [...(target as any)] : { ...(target as any) };
  for (const key of Object.keys(source as any)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    const sv: any = (source as any)[key];
    const tv: any = (out as any)[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      (out as any)[key] = deepMerge(tv, sv);
    } else {
      (out as any)[key] = sv;
    }
  }
  return out as T;
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  const body = await req.json().catch(() => ({}));
  const partial = body?.data || {};
  // Validate by applying partial merge to current and then sanitizing
  const current = await getFacts();
  const mergedData = deepMerge(current.data, partial);
  const safeData = zFactsData.parse(mergedData);
  const next: FactsDoc = bumpVersion({ ...current, data: safeData });
  await putFacts(next);
  const etag = computeEtag(next);
  return NextResponse.json(next, { status: 200, headers: { ETag: etag, 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' } });
}


