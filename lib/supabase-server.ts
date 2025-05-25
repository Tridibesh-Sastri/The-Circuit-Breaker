import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { cache } from "react"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Export with the name that's being imported elsewhere
export const createServerClient = cache(() => {
  const cookieStore = cookies()
  return createClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.delete({ name, ...options })
      },
    },
  })
})

// Also keep the original function for backward compatibility
export const createServerSupabaseClient = createServerClient

export async function getUserProfile() {
  const supabase = createServerClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    const { data: profile } = await supabase.from("profiles").select(`*`).eq("id", session.user.id).single()

    return profile
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}
