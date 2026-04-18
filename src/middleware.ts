// /service/dashboard/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // Track page views for the portfolio public pages
  // We only track the home page or specific routes to avoid tracking static files
  if (url === '/' || url.startsWith('/contact')) {
    // We cannot write files directly in standard Edge middleware on Vercel
    // But since this runs locally (Node runtime), we can trigger an API call to record it
    // Or if this is purely nextjs server component, we just hit an analytic API route
    try {
      fetch(new URL('/api/analytics/track', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          path: url, 
          userAgent: request.headers.get('user-agent') || 'Unknown',
          ip: request.headers.get('x-forwarded-for') || 'Unknown'
        })
      });
    } catch(e) {}
  }

  // Dashboard auth protection
  if (url.startsWith('/service/dashboard')) {
    const authCookie = request.cookies.get('loggedIn');

    if (!authCookie) {
      return NextResponse.redirect(new URL('/service/login', request.url));
    }
  }

  return NextResponse.next();
}

// Config to match public routes for tracking + dashboard routes for auth
export const config = {
  matcher: ['/', '/service/dashboard/:path*', '/contact'],
};
