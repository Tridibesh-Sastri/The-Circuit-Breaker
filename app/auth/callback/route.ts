import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const role = requestUrl.searchParams.get("role") || "member"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the user's session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      // Check if the user already has a profile
      const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (!existingProfile) {
        // Create a new profile for the user with default member role
        const { error: profileError } = await supabase.from("profiles").insert({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata.full_name || "",
          avatar_url: session.user.user_metadata.avatar_url || "",
          role: "member", // Default role is member
        })

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }

        // If the user selected a role other than member during registration, create a role request
        if (role === "alumni") {
          await supabase.from("role_requests").insert({
            user_id: session.user.id,
            requested_role: role,
            request_reason: "Requested during registration",
            status: "pending",
          })
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + "/dashboard")
}
