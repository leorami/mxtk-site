// app/api/ai/home/seed/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getHome, putHome } from '@/lib/home/store/fileStore';
import { migrateToV2 } from '@/lib/home/migrate';
import type { HomeDoc, SectionState, WidgetState } from '@/lib/home/types';

const NO_STORE = { 'Cache-Control': 'no-store' };

const SECTIONS: SectionState[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'learn',    title: 'Learn' },
  { id: 'build',    title: 'Build' },
  { id: 'operate',  title: 'Operate' },
  { id: 'library',  title: 'Library' },
];

function wid(i: number) { return `w${Date.now().toString(36)}${i}`; }

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const id = String(body?.id || 'default');
    const mode: 'learn' | 'build' | 'operate' =
      body?.mode === 'build' || body?.mode === 'operate' ? body.mode : 'learn';

    const existing = await getHome(id);
    if (existing && Array.isArray(existing.widgets) && existing.widgets.length > 0) {
      const { doc } = migrateToV2(existing);
      cookies().set('mxtk_home_id', id, { path: '/', httpOnly: false, sameSite: 'lax' });
      return NextResponse.json(doc, { headers: NO_STORE });
    }

    const base: HomeDoc = { id, version: 2, sections: SECTIONS, widgets: [] };

    const widgets: WidgetState[] = [
      { id: wid(0), type: 'what-next',       title: "What’s Next",     sectionId: 'overview', pos: { x: 0, y: 0 }, size: { w: 4, h: 24 } },
      { id: wid(1), type: 'recent-answers',  title: 'Recent Answers',  sectionId: 'overview', pos: { x: 4, y: 0 }, size: { w: 4, h: 24 } },
      { id: wid(2), type: 'custom-note',     title: 'Note',            sectionId: 'overview', pos: { x: 8, y: 0 }, size: { w: 4, h: 24 }, data: { note: '' } },
      {
        id: wid(3),
        type: 'mode-highlight',
        title: mode === 'build' ? 'Developer Docs' : mode === 'operate' ? 'Institutional Flows' : 'Getting Started',
        sectionId: mode,
        pos: { x: 0, y: 0 },
        size: { w: 6, h: 24 },
      },
    ];

    const doc: HomeDoc = { ...base, widgets };
    await putHome(doc);

    cookies().set('mxtk_home_id', id, { path: '/', httpOnly: false, sameSite: 'lax' });
    return NextResponse.json(doc, { headers: NO_STORE });
  } catch (e: any) {
    const detail = e?.stack || e?.message || String(e);
    console.error('POST /api/ai/home/seed failed:', detail);
    return NextResponse.json({ error: 'home-seed-failed', detail }, { status: 500, headers: NO_STORE });
  }
}