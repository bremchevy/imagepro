import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Define public paths that don't require authentication
    const publicPaths = [
      '/',
      '/login',
      '/signup',
      '/pricing',
      '/contact',
      '/about',
      '/tools',
      '/tools/background-removal',
      '/dashboard/account/user-management'
    ]

    // Define dashboard paths that require authentication
    const dashboardPaths = [
      '/dashboard',
      '/dashboard/account',
      '/dashboard/account/settings',
      '/dashboard/profile',
      '/dashboard/settings',
      '/dashboard/images'
    ]

    const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path))
    const isDashboardPath = dashboardPaths.some(path => req.nextUrl.pathname.startsWith(path))

    // If user is not signed in and trying to access a dashboard path,
    // redirect the user to /login
    if (!session && isDashboardPath) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and trying to access auth pages,
    // redirect the user to /dashboard
    if (session && ['/login', '/signup'].includes(req.nextUrl.pathname)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
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
  ],
}