// app/api/ai/home/seed/route.ts
import { toV2 } from '@/lib/home/migrate'
import { seedDoc } from '@/lib/home/seed'
import { readHome, writeHome } from '@/lib/home/store'
import { Experience } from '@/lib/home/types'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const url = new URL(req.url)
    const id = url.searchParams.get('id') || 'default'
    const adapt = url.searchParams.get('adapt') === 'true'
    const fromQuery = (url.searchParams.get('mode') || '') as Experience
    const cookieStore = cookies()
    const cookieMode = (await cookieStore.get('experience'))?.value || 'learn' as Experience
    const mode: Experience = (fromQuery === 'learn' || fromQuery === 'build' || fromQuery === 'operate') ? fromQuery : cookieMode

    const raw = (await readHome(id)) || { id, widgets: [] }
    let v2 = toV2(raw)
    v2 = seedDoc(v2, mode, adapt)
    await writeHome(v2)
    return NextResponse.json(v2, { status: 200 })
}