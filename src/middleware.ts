import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/verify',
  '/auth/reset-password',
  '/auth/update-password',
  '/tools',
  '/pricing',
  '/about',
  '/contact',
  '/dashboard/account/user-management'
]

// Define dashboard paths that require authentication
const dashboardPaths = [
  '/dashboard',
  '/dashboard/images',
  '/dashboard/settings',
  '/dashboard/account'
]

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the current path is public
    const isPublicPath = publicPaths.some(path => 
      req.nextUrl.pathname === path || 
      req.nextUrl.pathname.startsWith(path + '/')
    )

    // If it's a public path, allow access regardless of auth status
    if (isPublicPath) {
      return res
    }

    // Check if the current path is a dashboard path
    const isDashboardPath = dashboardPaths.some(path => 
      req.nextUrl.pathname === path || 
      req.nextUrl.pathname.startsWith(path + '/')
    )

    // If user is not signed in and trying to access a dashboard path,
    // redirect the user to /auth/signin
    if (!session && isDashboardPath) {
      const redirectUrl = new URL('/auth/signin', req.url)
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and trying to access auth pages,
    // redirect the user to /dashboard
    if (session && (req.nextUrl.pathname.startsWith('/auth'))) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is signed in and trying to access user management,
    // ensure they have a profile
    if (session && req.nextUrl.pathname.startsWith('/dashboard/account/user-management')) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!profile) {
        // If no profile exists, create one
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || '',
              avatar_url: session.user.user_metadata?.avatar_url || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (insertError) {
          console.error('Error creating user profile:', insertError)
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
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
    '/dashboard/:path*',
    '/api/dashboard/:path*',
  ],
}