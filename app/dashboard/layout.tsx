import type React from "react"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/auth")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  if (!profile) {
    // Create profile if it doesn't exist
    const { error } = await supabase.from("profiles").insert({
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.user_metadata.full_name || "",
      avatar_url: session.user.user_metadata.avatar_url || "",
      role: "member", // Default role is member
    })

    if (error) {
      console.error("Error creating profile:", error)
    }
  }

  const userRole = profile?.role || "member"

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={userRole} userId={session.user.id} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
