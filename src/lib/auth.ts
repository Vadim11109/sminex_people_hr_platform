import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { authConfig } from './auth.config'
import type { UserRole } from '@prisma/client'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },

  callbacks: {
    // Extend the edge-safe session callback
    ...authConfig.callbacks,

    // Runs in Node.js only — fetch roles from DB on first sign-in
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, roles: true },
        })
        token.userId = dbUser?.id
        token.roles = (dbUser?.roles ?? ['EMPLOYEE']) as UserRole[]
      }
      return token
    },

    // Override session callback to include typed roles
    async session({ session, token }) {
      session.user.id = token.userId as string
      session.user.roles = (token.roles ?? ['EMPLOYEE']) as UserRole[]
      return session
    },
  },
})
