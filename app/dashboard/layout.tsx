import type React from "react"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getOrCreateProfile } from "@/app/actions/profile-actions"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()

  // Get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Get or create user profile
  const { data: profile, error } = await getOrCreateProfile()

  if (error) {
    console.error("Profile error:", error)
    // Redirect to a profile setup page or auth page
    redirect("/auth?error=profile_creation_failed")
  }

  if (!profile) {
    console.error("No profile found and creation failed")
    redirect("/auth?error=no_profile")
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar profile={profile} />
      <div className="md:ml-64 min-h-screen w-full">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
