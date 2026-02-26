import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "ezdarta-manage-2024"
const ADMIN_COOKIE_NAME = "admin-access-token"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/login") ||
                       req.nextUrl.pathname.startsWith("/signup")

  // Handle secret admin access link: /admin-access/<SECRET_KEY>
  if (req.nextUrl.pathname === `/admin-access/${ADMIN_SECRET_KEY}`) {
    const response = NextResponse.redirect(new URL("/admin", req.nextUrl))
    response.cookies.set(ADMIN_COOKIE_NAME, ADMIN_SECRET_KEY, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })
    return response
  }

  // Block direct access to /admin without the access cookie
  if (isOnAdmin) {
    const accessCookie = req.cookies.get(ADMIN_COOKIE_NAME)
    if (accessCookie?.value !== ADMIN_SECRET_KEY) {
      return NextResponse.rewrite(new URL("/_not-found", req.nextUrl), { status: 404 })
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
  matcher: ["/dashboard/:path*", "/admin/:path*", "/admin-access/:path*", "/login", "/signup"],
}
