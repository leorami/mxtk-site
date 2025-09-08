import { getHome, putHome } from '@/lib/home/fileStore'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'

const PRESETS: Record<string, { type: string; title?: string; size: { w: number; h: number }; pos: { x: number; y: number } }[]> = {
    learn: [
        { type: 'getting-started', size: { w: 6, h: 6 }, pos: { x: 0, y: 0 } },
        { type: 'glossary-spotlight', size: { w: 3, h: 5 }, pos: { x: 6, y: 0 } },
        { type: 'recent-answers', size: { w: 6, h: 8 }, pos: { x: 0, y: 6 } },
        { type: 'custom-note', size: { w: 6, h: 5 }, pos: { x: 6, y: 6 } }
    ],
    build: [
        { type: 'recent-answers', size: { w: 7, h: 8 }, pos: { x: 0, y: 0 } },
        { type: 'resource-list', size: { w: 5, h: 8 }, pos: { x: 7, y: 0 } },
        { type: 'custom-note', size: { w: 12, h: 4 }, pos: { x: 0, y: 8 } }
    ],
    operate: [
        { type: 'recent-answers', size: { w: 8, h: 8 }, pos: { x: 0, y: 0 } },
        { type: 'glossary-spotlight', size: { w: 4, h: 5 }, pos: { x: 8, y: 0 } },
        { type: 'custom-note', size: { w: 12, h: 4 }, pos: { x: 0, y: 8 } }
    ]
}

export const runtime = 'nodejs'

export const POST = async (req: NextRequest) => {
    const body = await req.json().catch(() => ({} as any))
    const level = String(body.level || 'learn')
    const preset = PRESETS[level] || PRESETS.learn

    const jar = cookies()
    let homeId: string | undefined = body.homeId || jar.get('mxtk_home_id')?.value
    if (!homeId) homeId = crypto.randomUUID()

    let doc = await getHome(homeId)
    if (!doc) doc = { id: homeId, widgets: [], layoutVersion: 1 }

    if (Array.isArray(doc.widgets) && doc.widgets.length > 0) {
        jar.set('mxtk_home_id', homeId, { path: '/', sameSite: 'Lax' })
        return NextResponse.json(doc, { headers: { 'Cache-Control': 'no-store' } })
    }

    const seeded = preset.map(p => ({ id: crypto.randomUUID(), type: p.type, title: p.title, size: p.size, pos: p.pos }))
    const next = { ...doc, widgets: [...doc.widgets, ...seeded] }
    await putHome(next)
    jar.set('mxtk_home_id', homeId, { path: '/', sameSite: 'Lax' })
    return NextResponse.json(next, { headers: { 'Cache-Control': 'no-store' } })
}


