import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side Supabase client - only use in Server Components, Server Actions, and Route Handlers
export function createServerClient() {
  const cookieStore = cookies()

  return createClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          console.warn("Failed to set cookie:", error)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.delete({ name, ...options })
        } catch (error) {
          console.warn("Failed to delete cookie:", error)
        }
      },
    },
  })
}

// Also keep the original function for backward compatibility
export const createServerSupabaseClient = createServerClient

export async function getUserProfile() {
  try {
    const supabase = createServerClient()
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
