// /service/dashboard/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');

  // Check if the 'auth' cookie is set
  if (!authCookie) {
    // If not authenticated, redirect to login or return an error response
    return NextResponse.redirect(new URL('/service/login', request.url));
  }

  console.log("Middleware reached: User is authenticated");

  // Proceed if authenticated
  return NextResponse.next();
}

// Configure the middleware to match the dashboard route
export const config = {
  matcher: ['/service/dashboard/:path*'],  // Adjusted to include 
};
