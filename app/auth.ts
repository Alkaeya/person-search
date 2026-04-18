import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { z } from "zod"
import NextAuth from "next-auth"

function normalizeAuthUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined

  const trimmed = rawUrl.trim()
  if (!trimmed) return undefined

  try {
    return new URL(trimmed).origin
  } catch {
    try {
      return new URL(`https://${trimmed}`).origin
    } catch {
      return undefined
    }
  }
}

const resolvedAuthUrl = normalizeAuthUrl(
  process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
)

if (resolvedAuthUrl) {
  process.env.AUTH_URL = resolvedAuthUrl
  process.env.NEXTAUTH_URL = resolvedAuthUrl
}

const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const authConfig: NextAuthConfig = {
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage = nextUrl.pathname.startsWith("/auth")

      if (isAuthPage) {
        return true
      }

      return isLoggedIn
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      try {
        const urlObj = new URL(url)
        if (urlObj.origin === baseUrl) return url
      } catch {
        // Invalid URL, fallback to baseUrl
      }
      return baseUrl
    },
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const validatedCredentials = credentialsSchema.safeParse(credentials)

          if (!validatedCredentials.success) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.data.email },
          })

          if (!user) {
            return null
          }

          const passwordMatch = await compare(
            validatedCredentials.data.password,
            user.password
          )

          if (!passwordMatch) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  trustHost: true,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
