// app/api/ai/home/pin/route.ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { migrateToV2 } from '@/lib/home/migrate'
import { getHome, putHome } from '@/lib/home/store/fileStore'
import type { HomeDoc, WidgetState } from '@/lib/home/types'
import { NextResponse } from 'next/server'

const NO_STORE = { 'Cache-Control': 'no-store' }

export async function POST(req: Request) {
  try {
    const ct = (req.headers.get('content-type') || '').toLowerCase()
    let body: any = null
    if (ct.includes('application/json')) body = await req.json().catch(() => null)
    else if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const fd = await req.formData()
      body = Object.create(null)
      for (const [k, v] of fd.entries()) {
        if (k === 'widget' && typeof v === 'string') {
          try { body.widget = JSON.parse(v) } catch {}
        } else if (typeof v === 'string') {
          (body as any)[k] = v
        }
      }
      if (!body.widget) {
        // Accept flat fields like widget[type]
        const type = (fd.get('widget[type]') as string) || undefined
        if (type) body.widget = { type }
      }
    }

    const id = String(body?.id || 'default')
    const widget = body?.widget as Partial<WidgetState> | null
    if (!widget || typeof widget !== 'object' || !widget.type) {
      return NextResponse.json({ error: 'bad-widget' }, { status: 400, headers: NO_STORE })
    }

    const base = await getHome(id)
    let doc: HomeDoc
    if (!base) {
      doc = { id, layoutVersion: 2, sections: [], widgets: [] } as any
    } else {
      const mig = migrateToV2(base)
      doc = mig.doc
      if (mig.migrated) await putHome(doc)
    }

    // Ensure widget by type, update existing data if present
    const existsIdx = (doc.widgets || []).findIndex(w => w.type === widget.type)
    if (existsIdx >= 0) {
      const cur = doc.widgets[existsIdx]
      const data = widget.data && typeof widget.data === 'object' ? { ...(cur.data || {}), ...widget.data } : cur.data
      doc.widgets[existsIdx] = { ...cur, data }
    } else {
      const size = (widget.size as any) || { w: 6, h: 20 }
      const pos = { x: 0, y: 0 }
      const sectionId = (widget as any).sectionId || (doc.sections?.[0]?.id || 'overview')
      const next: WidgetState = {
        id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`,
        type: widget.type as any,
        title: widget.title as any,
        sectionId,
        size: size as any,
        pos,
        data: widget.data as any,
      }
      doc.widgets = [...(doc.widgets || []), next]
    }

    await putHome(doc)
    return NextResponse.json({ ok: true, doc }, { headers: NO_STORE })
  } catch (e: any) {
    const detail = e?.stack || e?.message || String(e)
    console.error('POST /api/ai/home/pin failed:', detail)
    return NextResponse.json({ error: 'pin-failed', detail }, { status: 500, headers: NO_STORE })
  }
}


