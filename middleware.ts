import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const fwdPrefix = req.headers.get('x-forwarded-prefix');
  const bp = fwdPrefix === '/mxtk' || url.pathname.startsWith('/mxtk') ? '/mxtk' : '';
  const res = NextResponse.next();
  // Persist the base path decision for this visitor so SSR and client share it
  res.cookies.set('bp', bp, { path: '/', sameSite: 'lax' });
  return res;
}

// Apply to all routes except Next internals and static files we don't need to touch
export const config = {
  matcher: [
    '/((?!_next/|favicon|robots|sitemap|manifest).*)'
  ]
};