import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // With Next.js basePath configuration, we mostly just need to add headers for ngrok
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-current-url', req.url);
  
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  
  // Add ngrok skip header to prevent browser warning
  res.headers.set('ngrok-skip-browser-warning', 'true');
  
  return res;
}

// Apply to all routes to ensure ngrok header is added
export const config = {
  matcher: [
    // Match all routes except Next.js internal paths and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};