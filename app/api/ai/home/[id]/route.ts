import { loadHome, saveHome } from '@/lib/home/store'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const doc = await loadHome(params.id)
  return NextResponse.json({ ok: true, doc })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null)
  if (!body || !Array.isArray(body.widgets)) return NextResponse.json({ ok: false }, { status: 400 })
  const saved = await saveHome({ id: params.id, updatedAt: new Date().toISOString(), widgets: body.widgets })
  return NextResponse.json({ ok: true, doc: saved })
}


