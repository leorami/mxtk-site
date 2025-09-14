import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // With Next.js basePath configuration, we mostly just need to add headers for ngrok
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-current-url', req.url);
  
  // Derive base path from the request pathname and advertise to the app
  const pathname = req.nextUrl.pathname || '';
  const isPrefixed = pathname.startsWith('/mxtk');
  if (isPrefixed) {
    requestHeaders.set('x-forwarded-prefix', '/mxtk');
  } else {
    requestHeaders.delete('x-forwarded-prefix');
  }
  
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  
  // Add ngrok skip header to prevent browser warning
  res.headers.set('ngrok-skip-browser-warning', 'true');
  
  // Keep a lightweight cookie so server components can consistently detect basePath
  if (isPrefixed) {
    res.cookies.set('bp', '/mxtk', { path: '/', httpOnly: false });
  } else {
    // Clear cookie if navigating outside prefixed area
    if (req.cookies.get('bp')) {
      res.cookies.set('bp', '', { path: '/', maxAge: 0 });
    }
  }
  
  return res;
}

// Apply to all routes to ensure ngrok header is added
export const config = {
  matcher: [
    // Match all routes except Next.js internal paths and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};