// app/api/ai/home/seed/route.ts
import { NextResponse } from 'next/server'
import { seedHome } from './logic'

export async function POST(req: Request){
  const body = await req.json().catch(()=> ({} as any))
  const stage = (body?.stage ?? body?.mode ?? 'training') as any
  const id = body?.id ?? null
  const adapt = !!body?.adapt
  try {
    const out = await seedHome({ id, stage, adapt })
    const res = NextResponse.json({ ...out })
    res.headers.set('Set-Cookie', `mxtk_home_id=${out.id}; Path=/; Max-Age=${60*60*24*180}; SameSite=Lax`)
    return res
  } catch (err:any) {
    // Never fail in dev: return a minimal doc so the client can proceed
    const fallback = { id: id || 'default', widgets: [], sections: [], stage }
    const res = NextResponse.json(fallback)
    res.headers.set('Set-Cookie', `mxtk_home_id=${fallback.id}; Path=/; Max-Age=${60*60*24*180}; SameSite=Lax`)
    return res
  }
}