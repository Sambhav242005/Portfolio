import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const loggedIn = request.cookies.get('loggedIn')?.value

  if (request.nextUrl.pathname.startsWith('/service/dashboard') && loggedIn !== 'true') {
    return NextResponse.redirect(new URL('/service/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/service/dashboard/:path*',
}