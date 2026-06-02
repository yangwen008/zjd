import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => req.cookies.get(n), set: (n,v,o) => res.cookies.set({name:n,value:v,...o}), remove: (n) => res.cookies.delete(n) } }
  )
  const { data: { user } } = await supabase.auth.getUser()

  if (!req.cookies.has('region_code')) {
    res.cookies.set('region_code', '510000', { maxAge: 2592000, path: '/' })
  }

  const pathname = req.nextUrl.pathname
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return res
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|api/r2).*)'] }