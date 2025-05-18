import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Flag to enable/disable authentication (set to false for testing)
const ENABLE_AUTH = false

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // If authentication is disabled, allow access to all routes
  if (!ENABLE_AUTH) {
    return res
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // If the user is not logged in and trying to access a protected route, redirect to login
  if (!session && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    const redirectUrl = new URL("/auth", request.url)
    redirectUrl.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is logged in and trying to access auth page, redirect to dashboard
  if (session && pathname === "/auth") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If the user is logged in, get their role
  if (session) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    const userRole = profile?.role || "member"

    // Redirect to appropriate dashboard based on role
    if (pathname === "/dashboard" || pathname === "/") {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url))
      } else if (userRole === "alumni") {
        return NextResponse.redirect(new URL("/dashboard/alumni", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard/member", request.url))
      }
    }

    // Protect admin routes
    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Protect alumni routes
    if (pathname.startsWith("/dashboard/alumni") && userRole !== "alumni" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
