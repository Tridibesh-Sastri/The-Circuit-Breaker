"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function createUserProfile() {
  const supabase = createServerClient()

  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: "No authenticated user found" }
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

    if (existingProfile) {
      return { error: "Profile already exists" }
    }

    // Create the profile
    const newProfile = {
      id: user.id,
      username: user.email?.split("@")[0] || `user_${Date.now()}`,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      avatar_url: user.user_metadata?.avatar_url || "",
      role: "member" as const,
      points: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("profiles").insert(newProfile).select().single()

    if (error) {
      console.error("Profile creation error:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard")
    return { data, error: null }
  } catch (error) {
    console.error("Unexpected error in profile creation:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function getOrCreateProfile() {
  const supabase = createServerClient()

  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { data: null, error: "No authenticated user found" }
    }

    // Try to get existing profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profile) {
      return { data: profile, error: null }
    }

    // If profile doesn't exist, create it
    if (profileError?.code === "PGRST116") {
      const createResult = await createUserProfile()
      if (createResult.error) {
        return { data: null, error: createResult.error }
      }
      return { data: createResult.data, error: null }
    }

    return { data: null, error: profileError?.message || "Unknown error" }
  } catch (error) {
    console.error("Error in getOrCreateProfile:", error)
    return { data: null, error: "An unexpected error occurred" }
  }
}
