import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  const supabase = createServerClient()

  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (error || !profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  return { session, profile }
}

export async function getProfile(userId: string) {
  const supabase = createServerClient()

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return profile
}
