import type { NextAuthConfig } from 'next-auth'
import AzureAD from 'next-auth/providers/microsoft-entra-id'

/**
 * Edge-safe auth config — no Prisma, no Node.js-only imports.
 * Used by middleware (Edge runtime) and extended by auth.ts (Node.js).
 */
export const authConfig = {
  providers: [
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  callbacks: {
    // Maps JWT token → session object so middleware can read roles
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string
      if (token.roles) session.user.roles = token.roles as string[] as never
      return session
    },
  },
} satisfies NextAuthConfig
