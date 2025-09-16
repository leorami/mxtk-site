// app/api/ai/home/seed/route.ts
import { NextResponse } from 'next/server'
import { seedHome } from './logic'

export async function POST(req: Request){
  const body = await req.json().catch(()=> ({}))
  const stage = (body?.stage ?? body?.mode ?? 'training') as any
  const id = body?.id ?? null
  const adapt = !!body?.adapt
  const out = await seedHome({ id, stage, adapt })
  const res = NextResponse.json({ home: out })
  res.headers.set('Set-Cookie', `mxtk_home_id=${out.id}; Path=/; Max-Age=${60*60*24*180}; SameSite=Lax`)
  return res
}