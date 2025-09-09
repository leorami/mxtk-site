// app/api/ai/home/[id]/route.ts
import { toV2 } from '@/lib/home/migrate'
import { readHome, writeHome } from '@/lib/home/store'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = await params.id
  const raw = (await readHome(id)) || { id, widgets: [] }
  const v2 = toV2(raw)
  // Write back if we migrated
  if ((raw as any).layoutVersion !== 2) {
    await writeHome(v2)
  }
  return NextResponse.json(v2, { status: 200 })
}

// PATCH payload: { id, widgets:[{ id, pos:{x,y}, size:{w,h} }] }
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = await params.id
  const body = await req.json().catch(() => ({}))
  const raw = (await readHome(id)) || { id, widgets: [] }
  const v2 = toV2(raw)

  const map = new Map(v2.widgets.map(w => [w.id, w]))
  for (const w of body.widgets || []) {
    const cur = map.get(w.id)
    if (cur) {
      cur.pos = w.pos || cur.pos
      cur.size = w.size || cur.size
    }
  }
  await writeHome(v2)
  return NextResponse.json({ ok: true }, { status: 200 })
}