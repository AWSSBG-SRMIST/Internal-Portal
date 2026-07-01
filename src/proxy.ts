import { NextRequest, NextResponse } from 'next/server';

// Inject the current pathname as a request header so Server Component layouts
// can read it via headers() and preserve deep-link URLs on auth redirects.
export function proxy(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
};
