import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (user) {
      // Redirect logged in users
      const { data: role } = await supabase.rpc('get_user_role', { user_id: user.id })

      const redirectUrl = role === 'admin' ? '/admin/dashboard' : '/portal/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    return supabaseResponse
  }

  // Protected routes
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based routing
  const { data: role } = await supabase.rpc('get_user_role', { user_id: user.id })

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/portal/dashboard', request.url))
  }

  if (pathname.startsWith('/portal') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return supabaseResponse
}
