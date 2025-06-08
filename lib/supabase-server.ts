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
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookie setting errors silently
          console.warn("Cookie setting error:", error)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.delete({ name, ...options })
        } catch (error) {
          // Handle cookie removal errors silently
          console.warn("Cookie removal error:", error)
        }
      },
    },
  })
})

// Also keep the original function for backward compatibility
export const createServerSupabaseClient = createServerClient

export async function getUserProfile() {
  try {
    const supabase = createServerClient()

    // Get session with timeout and retry logic
    let session = null
    let sessionError = null

    try {
      const sessionResult = (await Promise.race([
        supabase.auth.getSession(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Session timeout")), 5000)),
      ])) as any

      session = sessionResult.data?.session
      sessionError = sessionResult.error
    } catch (timeoutError) {
      console.error("Session timeout or error:", timeoutError)
      return null
    }

    if (sessionError) {
      console.error("Session error:", sessionError)
      return null
    }

    if (!session?.user) {
      console.log("No active session found")
      return null
    }

    // Try to get profile with better error handling
    try {
      const profileResult = (await Promise.race([
        supabase.from("profiles").select("*").eq("id", session.user.id).single(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Profile query timeout")), 5000)),
      ])) as any

      if (profileResult.error) {
        // If profile doesn't exist, create it
        if (profileResult.error.code === "PGRST116") {
          console.log("Profile not found, creating new profile...")
          return await createUserProfile(session.user)
        }

        console.error("Profile fetch error:", profileResult.error)
        return null
      }

      return profileResult.data
    } catch (profileError) {
      console.error("Profile query error:", profileError)

      // Try to create profile if query failed
      try {
        return await createUserProfile(session.user)
      } catch (createError) {
        console.error("Failed to create profile:", createError)
        return null
      }
    }
  } catch (error) {
    console.error("getUserProfile error:", error)
    return null
  }
}

async function createUserProfile(user: any) {
  try {
    const supabase = createServerClient()

    const profileData = {
      id: user.id,
      username: user.email?.split("@")[0] || `user_${Date.now()}`,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      avatar_url: user.user_metadata?.avatar_url || "",
      role: "member" as const,
      points: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("profiles").insert(profileData).select().single()

    if (error) {
      console.error("Profile creation error:", error)
      return null
    }

    console.log("Profile created successfully:", data)
    return data
  } catch (error) {
    console.error("createUserProfile error:", error)
    return null
  }
}
