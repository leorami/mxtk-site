// app/api/ai/home/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getHome, putHome } from '@/lib/home/store/fileStore';
import { migrateToV2 } from '@/lib/home/migrate';
import type { HomeDoc, WidgetState } from '@/lib/home/types';

const NO_STORE = { 'Cache-Control': 'no-store' };

function clampWidget(w: WidgetState): WidgetState {
  const wW = Math.max(1, Math.min(12, Number(w.size?.w ?? 3)));
  const wH = Math.max(1, Math.min(200, Number(w.size?.h ?? 24)));
  const pX = Math.max(0, Math.min(11, Number(w.pos?.x ?? 0)));
  const pY = Math.max(0, Math.min(10000, Number(w.pos?.y ?? 0)));
  return {
    ...w,
    size: { w: wW, h: wH },
    pos: { x: pX, y: pY },
  };
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id || 'default';
  try {
    const raw = await getHome(id);
    if (!raw) {
      // Missing or quarantined → allow the client to seed
      return NextResponse.json({ error: 'not-found' }, { status: 404, headers: NO_STORE });
    }
    const { doc, migrated } = migrateToV2(raw);
    if (migrated) await putHome(doc);

    // Refresh cookie for convenience
    cookies().set('mxtk_home_id', id, { path: '/', httpOnly: false, sameSite: 'lax' });

    return NextResponse.json(doc, { headers: NO_STORE });
  } catch (e) {
    console.error('GET /api/ai/home/[id] failed', e);
    return NextResponse.json({ error: 'home-get-failed' }, { status: 500, headers: NO_STORE });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id || 'default';
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'bad-body' }, { status: 400, headers: NO_STORE });
    }
    const { doc: coerced } = migrateToV2(body);
    if (coerced.id !== id) coerced.id = id;
    await putHome(coerced);
    return NextResponse.json({ ok: true, doc: coerced }, { headers: NO_STORE });
  } catch (e) {
    console.error('PUT /api/ai/home/[id] failed', e);
    return NextResponse.json({ error: 'home-put-failed' }, { status: 500, headers: NO_STORE });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id || 'default';
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'bad-body' }, { status: 400, headers: NO_STORE });
    }

    // Load current (and migrate if needed)
    const base = await getHome(id);
    let doc: HomeDoc;
    if (!base) {
      // If missing, initialize a bare doc and let the client re-render
      doc = { id, version: 2, sections: [], widgets: [] } as HomeDoc;
    } else {
      const mig = migrateToV2(base);
      doc = mig.doc;
      if (mig.migrated) await putHome(doc);
    }

    // Support both legacy single-widget shape and batch { widgets: [...] }
    const updates: Partial<WidgetState>[] = Array.isArray((body as any).widgets)
      ? (body as any).widgets
      : (body.id ? [body] : []);

    if (!updates.length) {
      return NextResponse.json({ error: 'no-updates' }, { status: 400, headers: NO_STORE });
    }

    // Apply updates
    let widgets = [...(doc.widgets || [])];

    for (const u of updates) {
      if (!u || typeof u !== 'object' || !u.id) continue;

      if ((u as any).remove) {
        widgets = widgets.filter(x => x.id !== u.id);
        continue;
      }

      const idx = widgets.findIndex(x => x.id === u.id);
      if (idx === -1) {
        // unknown id → skip silently
        continue;
      }

      const cur = widgets[idx];

      const next: WidgetState = clampWidget({
        ...cur,
        pos: (u as any).pos ? { ...cur.pos, ...(u as any).pos } : cur.pos,
        size: (u as any).size ? { ...cur.size, ...(u as any).size } : cur.size,
        pinned: typeof (u as any).pinned === 'boolean' ? !!(u as any).pinned : cur.pinned,
        data: (u as any).data && typeof (u as any).data === 'object'
          ? { ...(cur.data || {}), ...(u as any).data }
          : cur.data,
        sectionId: (u as any).sectionId ? String((u as any).sectionId) : cur.sectionId,
        title: (u as any).title ?? cur.title,
      });

      widgets[idx] = next;
    }

    const out: HomeDoc = { ...doc, widgets };
    await putHome(out);
    return NextResponse.json({ ok: true, doc: out }, { headers: NO_STORE });
  } catch (e) {
    console.error('PATCH /api/ai/home/[id] failed', e);
    return NextResponse.json({ error: 'home-patch-failed' }, { status: 500, headers: NO_STORE });
  }
}