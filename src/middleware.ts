import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "ezdarta-manage-2024"
const ADMIN_COOKIE = "ezdarta-admin-access"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname
  const isOnDashboard = pathname.startsWith("/dashboard")
  const isOnAdmin = pathname.startsWith("/admin")
  const isOnSecretAdmin = pathname.startsWith("/manage/")
  const isOnAuthPage = pathname.startsWith("/login") ||
                       pathname.startsWith("/signup")

  // Secret admin entry point — sets a permanent cookie and redirects to /admin
  if (isOnSecretAdmin && pathname === `/manage/${ADMIN_SECRET_KEY}`) {
    const response = NextResponse.redirect(new URL("/admin", req.nextUrl))
    response.cookies.set(ADMIN_COOKIE, ADMIN_SECRET_KEY, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
    return response
  }

  // Any other /manage/ path — not found
  if (isOnSecretAdmin) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  // Block /admin unless they have the access cookie
  if (isOnAdmin) {
    const cookie = req.cookies.get(ADMIN_COOKIE)
    if (cookie?.value !== ADMIN_SECRET_KEY) {
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl))
    }
    return NextResponse.next()
  }

  // Protect dashboard routes
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Redirect logged-in users away from auth pages
  if (isOnAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/admin", "/admin/:path*", "/manage/:path*", "/login", "/signup"],
}
