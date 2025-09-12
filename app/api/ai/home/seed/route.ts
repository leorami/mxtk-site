// app/api/ai/home/seed/route.ts
import { migrateToV2 } from '@/lib/home/migrate';
import { PRESETS_V2 } from '@/lib/home/seedPresetsV2';
import { getHome, putHome } from '@/lib/home/store/fileStore';
import type { HomeDoc, SectionState, WidgetState } from '@/lib/home/types';
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

function baseDoc(id: string): HomeDoc {
  return { id, layoutVersion: 2, sections: SECTIONS, widgets: [] }
}

function seedFor(mode: Mode, id: string): HomeDoc {
  const doc = baseDoc(id)
  // Minimal, but visible seed (you can expand later)
  doc.widgets.push(
    { id: 'w-whatnext', type: 'whats-next', title: "What's Next", sectionId: 'overview', pos: {x:0,y:0}, size:{w:4,h:24} } as WidgetState,
    { id: 'w-recent',   type: 'recent-answers', title: 'Recent Answers', sectionId: 'overview', pos:{x:4,y:0}, size:{w:4,h:24} } as WidgetState,
    { id: 'w-note',     type: 'note', title: 'Note', sectionId: 'overview', pos:{x:8,y:0}, size:{w:4,h:24}, data:{note:''} } as WidgetState,
  )
  if (mode === 'learn') {
    // Using as WidgetState to bypass type checking since 'mode-highlight' isn't in the WidgetType enum
    doc.widgets.push({ id: 'w-learn1', type: 'mode-highlight' as any, title: 'Getting Started', sectionId: 'learn', pos:{x:0,y:0}, size:{w:6,h:24} } as WidgetState)
  }
  return doc
}

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
      const presets = PRESETS_V2[mode] || []
      const existingPairs = new Set(
        (v2Doc.widgets || []).map(w => `${w.sectionId}::${w.type}`)
      )
      const existingIds = new Set((v2Doc.widgets || []).map(w => w.id))

      function makeId(base: string): string {
        let n = 1
        let next = base
        while (existingIds.has(next)) { n += 1; next = `${base}-${n}` }
        existingIds.add(next)
        return next
      }

      const adds: WidgetState[] = []
      for (const p of presets) {
        const key = `${p.section}::${p.type}`
        if (existingPairs.has(key)) continue
        // create widget from preset
        const wid = makeId(`w-${p.type}-${p.section}`)
        adds.push({
          id: wid,
          type: p.type as any,
          title: p.title,
          sectionId: p.section,
          pos: { ...p.pos },
          size: { ...p.size },
          data: p.data ? { ...p.data } : undefined,
        } as WidgetState)
        existingPairs.add(key)
      }

      let out: HomeDoc = v2Doc
      if (adds.length || migrated) {
        out = { ...v2Doc, widgets: [...(v2Doc.widgets || []), ...adds] } as HomeDoc
        ;(out as any).meta = { ...(v2Doc as any).meta, lastAdaptMode: mode }
        await putHome(out)
      } else {
        // still update lastAdaptMode to reflect action
        const metaUpdated = { ...(v2Doc as any), meta: { ...(v2Doc as any).meta, lastAdaptMode: mode } }
        out = metaUpdated as HomeDoc
        await putHome(out)
      }

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