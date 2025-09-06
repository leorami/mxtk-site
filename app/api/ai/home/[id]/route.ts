import { NextRequest, NextResponse } from 'next/server'
import { getHome, putHome } from '@/lib/home/fileStore'
import { safeParseHome } from '@/lib/home/schema'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const doc = await getHome(params.id)
  if (!doc) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })
  return NextResponse.json({ ok: true, doc }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null)
  const parsed = safeParseHome(body)
  if (!parsed.success || parsed.data.id !== params.id) {
    return NextResponse.json({ ok: false, error: 'bad payload' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  }
  const saved = await putHome(parsed.data)
  return NextResponse.json({ ok: true, doc: saved }, { headers: { 'Cache-Control': 'no-store' } })
}


