import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PASSWORD = '!PMAgentSquad!' // Simple hardcoded password

export function middleware(request: NextRequest) {
  // Skip auth for login page, API routes, static files, and documentation pages
  if (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/favicon') ||
    request.nextUrl.pathname.endsWith('.html') ||
    request.nextUrl.pathname.endsWith('.md') ||
    request.nextUrl.pathname.endsWith('.txt')
  ) {
    return NextResponse.next()
  }

  // Check if user has valid password cookie
  const authCookie = request.cookies.get('auth')?.value

  if (authCookie === PASSWORD) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
