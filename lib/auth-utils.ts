"use client"

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Error signing out:", error)
    return false
  }
  return true
}

export function useSignOut() {
  const router = useRouter()

  const handleSignOut = async () => {
    const success = await signOut()
    if (success) {
      router.push("/")
      router.refresh()
    }
  }

  return handleSignOut
}
