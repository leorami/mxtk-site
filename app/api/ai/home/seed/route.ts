// app/api/ai/home/seed/route.ts
import { migrateToV2 } from '@/lib/home/migrate';
import { PRESETS_V2 } from '@/lib/home/seedPresetsV2';
import { getHome, putHome } from '@/lib/home/store/fileStore';
import type { HomeDoc, SectionState, WidgetState } from '@/lib/home/types';
import { adaptDocWithPresets, buildSeedDocFromPresets } from '@/lib/home/seedUtil'
import { promises as fs } from 'fs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

type Mode = 'learn' | 'build' | 'operate'

// Ensure the directory exists
async function ensureStoreDir() {
  const ROOT = process.cwd();
  const HOMES_DIR = path.join(ROOT, 'ai_store', 'homes');
  await fs.mkdir(HOMES_DIR, { recursive: true });
  return HOMES_DIR;
}

const SECTIONS: SectionState[] = [
  { id: 'overview', key: 'overview', title: 'Overview', order: 0 },
  { id: 'learn',    key: 'learn',    title: 'Learn',    order: 1 },
  { id: 'build',    key: 'build',    title: 'Build',    order: 2 },
  { id: 'operate',  key: 'operate',  title: 'Operate',  order: 3 },
  { id: 'library',  key: 'library',  title: 'Library',  order: 4 }
]

function baseDoc(id: string): HomeDoc { return { id, layoutVersion: 2, sections: SECTIONS, widgets: [] } }

function seedFor(mode: Mode, id: string): HomeDoc { return buildSeedDocFromPresets(id, mode) }

export async function POST(req: NextRequest) {
  try {
    // Explicitly ensure the store directory exists first
    await ensureStoreDir();
    
    // Parse the request body
    const body = await req.json().catch(() => ({} as any))
    const id = (body.id as string) || 'default'
    const mode = ((body.mode as Mode) || 'learn')
    const adapt = Boolean(body?.adapt)

    // If a home already exists
    const existing = await getHome(id)
    if (existing) {
      // Always migrate to V2 shape
      const { doc: v2Doc, migrated } = migrateToV2(existing)

      if (!adapt) {
        if (migrated) await putHome(v2Doc)
        cookies().set('mxtk_home_id', id, { path: '/', sameSite: 'lax' })
        return NextResponse.json(v2Doc, { headers: { 'cache-control': 'no-store' } })
      }

      // Adapt merge: append missing widgets from presets for the mode
      const out: HomeDoc = adaptDocWithPresets(v2Doc, mode)
      await putHome(out)

      cookies().set('mxtk_home_id', id, { path: '/', sameSite: 'lax' })
      return NextResponse.json(out, { headers: { 'cache-control': 'no-store' } })
    }

    // Create and save a new home document
    const doc = seedFor(mode, id)
    ;(doc as any).meta = { lastAdaptMode: mode }
    await putHome(doc)
    cookies().set('mxtk_home_id', id, { path: '/', sameSite: 'lax' })
    return NextResponse.json(doc, { headers: { 'cache-control': 'no-store' } })
  } catch (err) {
    console.error('home-seed-failed', err)
    return NextResponse.json({ 
      error: 'home-seed-failed', 
      message: err instanceof Error ? err.message : String(err) 
    }, { status: 500, headers: { 'cache-control': 'no-store' } })
  }
}