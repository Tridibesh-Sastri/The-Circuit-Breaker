"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "admin" | "member" | "alumni"
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth")
          return
        }

        setUser(session.user)

        // Fetch user profile if role checking is required
        if (requiredRole) {
          const { data: userProfile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (error || !userProfile) {
            console.error("Error fetching profile:", error)
            router.push("/auth")
            return
          }

          setProfile(userProfile)

          // Check if user has required role
          if (userProfile.role !== requiredRole) {
            router.push("/dashboard")
            return
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/auth")
      } else if (event === "SIGNED_IN") {
        setUser(session.user)
        // Refetch profile if needed
        if (requiredRole) {
          const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
          setProfile(userProfile)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [requiredRole, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!user) {
    return fallback || null
  }

  if (requiredRole && (!profile || profile.role !== requiredRole)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-400">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
