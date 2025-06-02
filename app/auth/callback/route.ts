import { createServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/dashboard"

  if (code) {
    try {
      const supabase = createServerClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(new URL("/auth?error=callback_error", request.url))
      }

      // Check if user has a profile, if not redirect to setup
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (!profile) {
          return NextResponse.redirect(new URL("/auth/setup", request.url))
        }
      }

      return NextResponse.redirect(new URL(redirectTo, request.url))
    } catch (error) {
      console.error("Unexpected auth callback error:", error)
      return NextResponse.redirect(new URL("/auth?error=unexpected_error", request.url))
    }
  }

  return NextResponse.redirect(new URL("/auth", request.url))
}
