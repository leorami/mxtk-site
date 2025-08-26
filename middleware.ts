import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Pass through all requests - no auth
  return NextResponse.next();
}

export const config = { matcher: ['/:path*'] };