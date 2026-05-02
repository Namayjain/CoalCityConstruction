import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if trying to access protected admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin') {
    const authCookie = request.cookies.get('admin_auth');
    
    // Very simple check: In a real app, use JWT. 
    // Here we just check if the cookie exists and matches a simple signature.
    if (!authCookie || authCookie.value !== 'authenticated') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
