import { addWidget } from '@/lib/home/store'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

function getHomeId() {
  const c = cookies()
  let id = c.get('mxtk_home_id')?.value
  if (!id) {
    id = 'h_' + Math.random().toString(36).slice(2)
    c.set('mxtk_home_id', id, { path: '/', httpOnly: false, sameSite: 'Lax' })
  }
  return id
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any))
  const homeId: string = body.homeId || getHomeId()
  const w = body.widget
  if (!w || !w.type) return NextResponse.json({ ok: false }, { status: 400 })
  const doc = await addWidget(homeId, { type: w.type, title: w.title, data: w.data, pinned: !!w.pinned })
  return NextResponse.json({ ok: true, homeId, doc })
}


