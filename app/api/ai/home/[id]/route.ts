// app/api/ai/home/[id]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { env } from '@/lib/env';
import { readHomeIdCookie, writeHomeIdCookie } from '@/lib/home/cookies';
import { migrateToV2 } from '@/lib/home/migrate';
import { zHomePatch } from '@/lib/home/schema';
import { adaptDocWithPresets, buildSeedDocFromPresets } from '@/lib/home/seedUtil';
import { getHome as readHome, putHome as writeHome } from '@/lib/home/store/fileStore';
import type { HomeDoc, WidgetState } from '@/lib/home/types';
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';

const NO_STORE = { 'Cache-Control': 'no-store' };

function clampWidget(w: WidgetState): WidgetState {
  const wW = Math.max(1, Math.min(12, Number(w.size?.w ?? 3)));
  const wH = Math.max(1, Math.min(200, Number(w.size?.h ?? 24)));
  const pX = Math.max(0, Math.min(11, Number(w.pos?.x ?? 0)));
  const pY = Math.max(0, Math.min(10000, Number(w.pos?.y ?? 0)));
  return { ...w, size: { w: wW, h: wH }, pos: { x: pX, y: pY } };
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await ctx.params;
  const url = new URL(req.url)
  const qSeed = url.searchParams.get('autoSeed') === '1'
  const requestedId = rawId || 'default'
  try {
    // Cookie-based personal doc provisioning
    const cookieId = await readHomeIdCookie()

    if (!cookieId || requestedId === 'default') {
      const newId = randomUUID()
      const base: HomeDoc = { id: newId, layoutVersion: 2, sections: [
        { id: 'overview', key: 'overview', title: 'Overview', order: 0 },
        { id: 'learn',    key: 'learn',    title: 'Learn',    order: 1 },
        { id: 'build',    key: 'build',    title: 'Build',    order: 2 },
        { id: 'operate',  key: 'operate',  title: 'Operate',  order: 3 },
        { id: 'library',  key: 'library',  title: 'Library',  order: 4 },
      ], widgets: [] }
      await writeHome(base)
      const seeded = buildSeedDocFromPresets(newId, 'build')
      await writeHome(seeded)
      await writeHomeIdCookie(newId)
      return NextResponse.json({ id: newId, ...seeded }, { headers: NO_STORE })
    }

    // Load cookie's doc; recreate if missing
    const existing = await readHome(cookieId)
    if (!existing) {
      const base: HomeDoc = { id: cookieId, layoutVersion: 2, sections: [
        { id: 'overview', key: 'overview', title: 'Overview', order: 0 },
        { id: 'learn',    key: 'learn',    title: 'Learn',    order: 1 },
        { id: 'build',    key: 'build',    title: 'Build',    order: 2 },
        { id: 'operate',  key: 'operate',  title: 'Operate',  order: 3 },
        { id: 'library',  key: 'library',  title: 'Library',  order: 4 },
      ], widgets: [] }
      await writeHome(base)
      const seeded = buildSeedDocFromPresets(cookieId, 'build')
      await writeHome(seeded)
      return NextResponse.json(seeded, { headers: NO_STORE })
    }

    // migrate and defaults
    const { doc, migrated } = migrateToV2(existing)
    let changed = false
    const widgets = (doc.widgets || []).map(w => {
      if (w.type === 'pools-mini') {
        const token = (w.data as any)?.token
        if (!token) { changed = true; return { ...w, data: { ...(w.data || {}), token: env.MXTK_TOKEN_ADDRESS } as any } }
      }
      if (w.type === 'price-mini') {
        const symbol = (w.data as any)?.symbol
        if (!symbol) { changed = true; return { ...w, data: { ...(w.data || {}), symbol: 'MXTK' } as any } }
      }
      return w
    })
    if (changed) (doc as any).widgets = widgets

    // Empty or explicit autoSeed -> adapt seed idempotently
    const isEmpty = (Array.isArray(doc.widgets) ? doc.widgets.length : 0) === 0
    if (isEmpty || qSeed) {
      const out = adaptDocWithPresets(doc, 'build')
      await writeHome(out)
      return NextResponse.json(out, { headers: NO_STORE })
    }

    if (migrated || changed) await writeHome(doc)
    return NextResponse.json(doc, { headers: NO_STORE })
  } catch (e: any) {
    const detail = e?.stack || e?.message || String(e);
    console.error('GET /api/ai/home/[id] failed:', detail);
    return NextResponse.json({ error: 'home-get-failed', detail }, { status: 500, headers: NO_STORE });
  }
}
 

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await ctx.params;
  const id = rawId || 'default';
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'bad-body' }, { status: 400, headers: NO_STORE });
    }
    const { doc } = migrateToV2(body);
    doc.id = id;
    await writeHome(doc);
    return NextResponse.json({ ok: true, doc }, { headers: NO_STORE });
  } catch (e: any) {
    const detail = e?.stack || e?.message || String(e);
    console.error('PUT /api/ai/home/[id] failed:', detail);
    return NextResponse.json({ error: 'home-put-failed', detail }, { status: 500, headers: NO_STORE });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await ctx.params;
  const id = rawId || 'default';
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'bad-body' }, { status: 400, headers: NO_STORE });
    }
    const parsed = zHomePatch.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'bad-body', detail: parsed.error.flatten() }, { status: 400, headers: NO_STORE });
    }
    const valid = parsed.data as any;

    const base = await readHome(id);
    let doc: HomeDoc;
    if (!base) {
      doc = { id, version: 2, sections: [], widgets: [] } as HomeDoc;
    } else {
      const mig = migrateToV2(base);
      doc = mig.doc;
      if (mig.migrated) await writeHome(doc);
    }

    const updates: Partial<WidgetState>[] = Array.isArray(valid.widgets)
      ? valid.widgets
      : (body?.id ? [body as Partial<WidgetState>] : []);

    if (!updates.length && !Array.isArray(valid.sections)) {
      return NextResponse.json({ error: 'no-updates' }, { status: 400, headers: NO_STORE });
    }

    let widgets = [...(doc.widgets || [])];
    for (const u of updates) {
      if (!u?.id) continue;
      if ((u as any).remove) {
        widgets = widgets.filter(x => x.id !== u.id);
        continue;
      }
      const idx = widgets.findIndex(x => x.id === u.id);
      if (idx === -1) continue;
      const cur = widgets[idx];
      const next: WidgetState = clampWidget({
        ...cur,
        pos: u.pos ? { ...cur.pos, ...u.pos } : cur.pos,
        size: u.size ? { ...cur.size, ...u.size } : cur.size,
        pinned: typeof u.pinned === 'boolean' ? u.pinned : cur.pinned,
        data: u.data && typeof u.data === 'object' ? { ...(cur.data || {}), ...u.data } : cur.data,
        sectionId: u.sectionId ? String(u.sectionId) : cur.sectionId,
        title: u.title ?? cur.title,
      });
      widgets[idx] = next;
    }

    // apply section patches if provided
    if (Array.isArray(valid.sections) && valid.sections.length) {
      const nextSections = [...(doc.sections || [])];
      for (const s of valid.sections) {
        const idx = nextSections.findIndex(x => x.id === s.id);
        if (idx >= 0) {
          nextSections[idx] = {
            ...nextSections[idx],
            ...(Object.prototype.hasOwnProperty.call(s, 'collapsed') ? { collapsed: !!(s as any).collapsed } : {}),
            ...(Object.prototype.hasOwnProperty.call(s, 'order') ? { order: (s as any).order } : {}),
          } as typeof nextSections[number];
        }
      }
      (doc as any).sections = nextSections;
    }

    const out: HomeDoc = { ...doc, widgets };
    await writeHome(out);
    return NextResponse.json({ ok: true, doc: out }, { headers: NO_STORE });
  } catch (e: any) {
    const detail = e?.stack || e?.message || String(e);
    console.error('PATCH /api/ai/home/[id] failed:', detail);
    return NextResponse.json({ error: 'home-patch-failed', detail }, { status: 500, headers: NO_STORE });
  }
}