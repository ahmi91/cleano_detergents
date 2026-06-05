import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that require admin authentication
const ADMIN_PATHS = ['/admin']
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/forgot-password', '/admin/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's an admin path
  if (pathname.startsWith('/admin')) {
    // Allow public paths without auth
    if (PUBLIC_ADMIN_PATHS.some(path => pathname === path)) {
      return NextResponse.next()
    }

    // Check for admin session token
    const token = request.cookies.get('admin_token')?.value

    if (!token && pathname.startsWith('/admin') && !PUBLIC_ADMIN_PATHS.includes(pathname)) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
