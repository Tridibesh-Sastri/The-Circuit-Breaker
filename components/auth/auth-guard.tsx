"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "admin" | "member" | "alumni"
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const { user, profile, loading } = useAuth()
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth")
        return
      }

      if (requiredRole && (!profile || profile.role !== requiredRole)) {
        router.push("/dashboard")
        return
      }

      setChecking(false)
    }
  }, [user, profile, loading, requiredRole, router])

  if (loading || checking) {
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
