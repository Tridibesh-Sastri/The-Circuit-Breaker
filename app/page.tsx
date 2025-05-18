"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import LandingPage from "@/components/landing-page"

// Flag to enable/disable authentication (set to false for testing)
const ENABLE_AUTH = false

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (ENABLE_AUTH) {
      const checkAuth = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          router.push("/dashboard")
        }
      }

      checkAuth()
    }
  }, [router])

  return <LandingPage />
}
