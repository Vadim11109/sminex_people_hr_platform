import type { UserRole } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      roles: UserRole[]
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
    roles?: UserRole[]
  }
}
