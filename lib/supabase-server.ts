import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { cache } from "react"

export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
})

export async function getSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getUserProfile() {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  if (!session) {
    return null
  }

  try {
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return profile
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function isAdmin() {
  const profile = await getUserProfile()
  return profile?.role === "admin"
}

export async function isAlumni() {
  const profile = await getUserProfile()
  return profile?.role === "alumni"
}
