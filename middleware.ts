// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Basic Auth for non-production (Preview/Dev) deploys.
 * Enabled by default in non-production unless BASIC_AUTH_ENABLED=0.
 * In production (VERCEL_ENV === 'production'), it's OFF by default.
 *
 * Env vars:
 *  - BASIC_AUTH_ENABLED: "1" to force ON, "0" to force OFF (non-prod default is ON)
 *  - BASIC_USER: username (required when enabled)
 *  - BASIC_PASS: password (required when enabled)
 */

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="MXTK Staging", charset="UTF-8"',
    },
  })
}

export function middleware(request: NextRequest) {
  // Authentication disabled for now
  return NextResponse.next()

  // Example public bypasses (health checks etc.)
  const { pathname } = new URL(request.url)
  if (pathname.startsWith('/api/health')) return NextResponse.next()

  const user = process.env.BASIC_USER ?? ''
  const pass = process.env.BASIC_PASS ?? ''

  // If missing creds in env, fail closed
  if (!user || !pass) return unauthorized()

  const header = request.headers.get('authorization') || ''
  const [scheme, encoded] = header.split(' ')

  if (scheme !== 'Basic' || !encoded) return unauthorized()

  // Decode the "user:pass" from Basic auth header (Edge runtime supports atob)
  let decoded = ''
  try {
    decoded = atob(encoded)
  } catch {
    return unauthorized()
  }

  const [u, p] = decoded.split(':')
  if (u === user && p === pass) return NextResponse.next()

  return unauthorized()
}

export const config = {
  matcher: [
    // Protect everything except static assets and public files.
    // Add folders to this negative lookahead as needed.
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|mockups/|assets/|public/).*)',
  ],
}