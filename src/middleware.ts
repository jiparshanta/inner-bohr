import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/login") ||
                       req.nextUrl.pathname.startsWith("/signup")

  console.log("[Middleware]", {
    path: req.nextUrl.pathname,
    isLoggedIn,
    hasAuth: !!req.auth,
    userId: req.auth?.user?.id,
  })

  // Protect dashboard and admin routes
  if ((isOnDashboard || isOnAdmin) && !isLoggedIn) {
    console.log("[Middleware] Redirecting to login - not authenticated")
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Redirect logged-in users away from auth pages
  if (isOnAuthPage && isLoggedIn) {
    console.log("[Middleware] Redirecting to dashboard - already authenticated")
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
}
