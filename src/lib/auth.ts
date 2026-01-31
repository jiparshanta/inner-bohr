import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

declare module "next-auth" {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role?: string
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Note: Don't use adapter with credentials + JWT strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("[Auth] Missing credentials")
            return null
          }

          const email = credentials.email as string
          const password = credentials.password as string

          console.log("[Auth] Looking up user:", email)

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            console.log("[Auth] User not found or no password")
            return null
          }

          // Check if user is active
          if (!user.isActive) {
            console.log("[Auth] User is inactive")
            return null
          }

          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            console.log("[Auth] Invalid password")
            return null
          }

          console.log("[Auth] Login successful for:", email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("[Auth] Error during authorization:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log("[Auth JWT]", { trigger, hasUser: !!user, tokenSub: token.sub })
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      console.log("[Auth Session]", { tokenId: token.id, tokenRole: token.role })
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string | undefined
      }
      return session
    },
  },
})
