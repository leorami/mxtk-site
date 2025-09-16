// lib/home/cookies.ts
import { getServerBasePath } from '@/lib/routing/serverBasePath'
import { cookies } from 'next/headers'

const COOKIE = 'mxtk_home_id'

export async function readHomeIdCookie(): Promise<string | undefined> {
  try {
    const store = await cookies()
    return store.get(COOKIE)?.value
  } catch {
    return undefined
  }
}

export async function writeHomeIdCookie(id: string): Promise<void> {
  try {
    const basePath = await getServerBasePath()
    const store = await cookies()
    store.set(COOKIE, id, {
      httpOnly: true,
      sameSite: 'lax',
      path: basePath || '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  } catch {}
}

export const HOME_COOKIE_NAME = COOKIE


