import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient(
      { req, res },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      }
    )

    // Refresh session if expired
    await supabase.auth.getSession()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // List of paths that require authentication
    const protectedPaths = ['/dashboard', '/dashboard/*', '/settings', '/profile', '/account', '/account/*']
    const isProtectedPath = protectedPaths.some(path => {
      if (path.endsWith('/*')) {
        const basePath = path.slice(0, -2)
        return req.nextUrl.pathname.startsWith(basePath)
      }
      return req.nextUrl.pathname === path
    })

    // If user is not signed in and trying to access a protected path,
    // redirect the user to /login
    if (!session && isProtectedPath) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and trying to access auth pages,
    // redirect the user to /dashboard
    if (session && req.nextUrl.pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // Return next response if there's an error
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}