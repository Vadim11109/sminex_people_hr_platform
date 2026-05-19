import NextAuth from 'next-auth'
import { authConfig } from './lib/auth.config'
import { NextResponse } from 'next/server'

// Edge-safe: uses authConfig which has no Prisma/Node.js imports
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const roles = session?.user?.roles ?? []

  // Not authenticated → signin
  if (!session) {
    if (pathname.startsWith('/auth')) return NextResponse.next()
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Root → redirect based on primary role
  if (pathname === '/') {
    if (roles.includes('HR'))       return NextResponse.redirect(new URL('/hr', req.url))
    if (roles.includes('MANAGER'))  return NextResponse.redirect(new URL('/manager', req.url))
    return NextResponse.redirect(new URL('/employee', req.url))
  }

  // Multi-role: if user has only 1 role, block access to other role routes
  if (pathname.startsWith('/hr') && !roles.includes('HR')) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  if (pathname.startsWith('/manager') && !roles.includes('MANAGER')) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  if (pathname.startsWith('/employee') && !roles.includes('EMPLOYEE')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
