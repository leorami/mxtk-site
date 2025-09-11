// app/api/ai/home/seed/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getHome, putHome } from '@/lib/home/store/fileStore'
import type { HomeDoc } from '@/lib/home/types'

type Mode = 'learn' | 'build' | 'operate'

const SECTIONS = [
  { id: 'overview', title: 'Overview' },
  { id: 'learn',    title: 'Learn' },
  { id: 'build',    title: 'Build' },
  { id: 'operate',  title: 'Operate' },
  { id: 'library',  title: 'Library' }
]

function baseDoc(id: string): HomeDoc {
  return { id, version: 2, sections: SECTIONS, widgets: [] as any }
}

function seedFor(mode: Mode, id: string): HomeDoc {
  const doc = baseDoc(id)
  // Minimal, but visible seed (you can expand later)
  doc.widgets.push(
    { id: 'w-whatnext', type: 'what-next', title: "What's Next", sectionId: 'overview', pos: {x:0,y:0}, size:{w:4,h:24} },
    { id: 'w-recent',   type: 'recent-answers', title: 'Recent Answers', sectionId: 'overview', pos:{x:4,y:0}, size:{w:4,h:24} },
    { id: 'w-note',     type: 'custom-note', title: 'Note', sectionId: 'overview', pos:{x:8,y:0}, size:{w:4,h:24}, data:{note:''} },
  )
  if (mode === 'learn') {
    doc.widgets.push({ id: 'w-learn1', type: 'mode-highlight', title: 'Getting Started', sectionId: 'learn', pos:{x:0,y:0}, size:{w:6,h:24} })
  }
  return doc as any
}

export async function POST(req: NextRequest) {
  try {
    // Using getHome/putHome functions which already call ensureDir internally
    const body = await req.json().catch(() => ({} as any))
    const id = (body.id as string) || 'default'
    const mode = ((body.mode as Mode) || 'learn')

    // If a home already exists, just return it; seed is idempotent.
    const existing = await getHome(id)
    if (existing?.sections?.length) {
      cookies().set('mxtk_home_id', id, { path: '/', sameSite: 'lax' })
      return NextResponse.json(existing, { headers: { 'cache-control': 'no-store' } })
    }

    const doc = seedFor(mode, id)
    await putHome(doc)
    cookies().set('mxtk_home_id', id, { path: '/', sameSite: 'lax' })
    return NextResponse.json(doc, { headers: { 'cache-control': 'no-store' } })
  } catch (err) {
    console.error('home-seed-failed', err)
    return NextResponse.json({ error: 'home-seed-failed' }, { status: 500, headers: { 'cache-control': 'no-store' } })
  }
}