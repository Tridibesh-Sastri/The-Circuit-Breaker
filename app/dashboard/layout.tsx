import type React from "react"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { RoleSwitcher } from "@/components/dashboard/role-switcher"
import { headers } from "next/headers"

// Flag to enable/disable authentication (set to false for testing)
const ENABLE_AUTH = false

// Mock profiles for testing different roles
const mockProfiles = {
  admin: {
    id: "mock-admin-id",
    username: "admin",
    full_name: "Admin User",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "admin",
    email: "admin@circuitbreaker.com",
    bio: "Club administrator",
    projects_count: 5,
    events_attended: 12,
    points: 350,
  },
  member: {
    id: "mock-member-id",
    username: "member",
    full_name: "Member User",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "member",
    email: "member@circuitbreaker.com",
    bio: "Regular club member",
    projects_count: 3,
    events_attended: 8,
    points: 150,
  },
  alumni: {
    id: "mock-alumni-id",
    username: "alumni",
    full_name: "Alumni User",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "alumni",
    email: "alumni@circuitbreaker.com",
    bio: "Former club member",
    projects_count: 10,
    events_attended: 20,
    points: 500,
    industry: "Electronics Manufacturing",
    graduation_year: "2020",
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  let profile = null
  let user = null

  if (ENABLE_AUTH) {
    // Real authentication flow
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/auth")
    }

    user = session.user

    // Fetch user profile
    const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

    if (!userProfile) {
      // Create profile if it doesn't exist
      const newProfile = {
        id: session.user.id,
        username: session.user.email?.split("@")[0] || `user_${Date.now()}`,
        full_name: session.user.user_metadata.full_name || "",
        avatar_url: session.user.user_metadata.avatar_url || "",
        role: "member", // Default role is member
      }

      const { error } = await supabase.from("profiles").insert(newProfile)

      if (error) {
        console.error("Error creating profile:", error)
      }

      profile = newProfile
    } else {
      profile = userProfile
    }
  } else {
    // For testing: determine which mock profile to use based on the URL path
    // Get the current path from headers instead of relying on VERCEL_URL
    const headersList = headers()
    const pathname = headersList.get("x-pathname") || headersList.get("x-url") || ""

    if (pathname.includes("/admin")) {
      profile = mockProfiles.admin
      user = { email: mockProfiles.admin.email }
    } else if (pathname.includes("/alumni")) {
      profile = mockProfiles.alumni
      user = { email: mockProfiles.alumni.email }
    } else {
      profile = mockProfiles.member
      user = { email: mockProfiles.member.email }
    }
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar profile={profile} />

      {/* Add the role switcher component for testing */}
      {!ENABLE_AUTH && <RoleSwitcher />}

      <div className="md:ml-64 min-h-screen w-full">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
