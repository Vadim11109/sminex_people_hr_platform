import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// AUTH DISABLED — dev mode, all routes open
export default function proxy(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
