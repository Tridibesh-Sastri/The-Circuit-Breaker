import type React from "react"
import { AuthService } from "@/lib/auth-enhanced"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authService = new AuthService(true)

  // Get the current user session
  const session = await authService.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Get user profile with enhanced error handling
  const profile = await authService.getProfile(session.user.id)

  if (!profile) {
    console.error("No profile found for authenticated user")
    redirect("/auth?error=no_profile")
  }

  // Check account status
  if (profile.status === "suspended") {
    redirect("/auth?error=account_suspended")
  }

  if (profile.status === "pending") {
    redirect("/auth?error=account_pending")
  }

  // Check if profile is complete (except for profile completion page)
  if (!profile.profile_completed && !children?.toString().includes("profile/complete")) {
    redirect("/dashboard/profile/complete")
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
