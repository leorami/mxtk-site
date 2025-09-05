import { loadHome, saveHome, type Home } from '@/lib/home/store'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const h = await loadHome(params.id)
  if (!h) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })
  return NextResponse.json({ ok: true, home: h })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  if (!body?.home || body.home.id !== params.id) return NextResponse.json({ ok: false, error: 'bad payload' }, { status: 400 })
  await saveHome(body.home as Home)
  return NextResponse.json({ ok: true })
}


