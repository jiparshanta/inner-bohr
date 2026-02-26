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

  // Secret admin entry point — redirect to /admin with token in query
  if (isOnSecretAdmin && pathname === `/manage/${ADMIN_SECRET_KEY}`) {
    return NextResponse.redirect(new URL(`/admin?token=${ADMIN_SECRET_KEY}`, req.nextUrl))
  }

  // Any other /manage/ path — go home
  if (isOnSecretAdmin) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  // Admin route protection
  if (isOnAdmin) {
    const cookie = req.cookies.get(ADMIN_COOKIE)
    const token = req.nextUrl.searchParams.get("token")

    // Valid access: cookie or correct token in URL
    const hasAccess = cookie?.value === ADMIN_SECRET_KEY || token === ADMIN_SECRET_KEY

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl))
    }

    // Set/refresh the cookie so internal navigation works
    const response = NextResponse.next()
    response.cookies.set(ADMIN_COOKIE, ADMIN_SECRET_KEY, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
    return response
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
