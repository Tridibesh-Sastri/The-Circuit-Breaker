"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

export function HandleRegistration() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleRegistration = async () => {
      try {
        // Check if there's a requested role in localStorage
        const requestedRole = localStorage.getItem("requestedRole")

        if (requestedRole) {
          // Get the current user
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (user) {
            // Create a role request
            await supabase.from("role_requests").insert({
              user_id: user.id,
              requested_role: requestedRole,
              request_reason: "Initial registration request",
              status: "pending",
            })

            // Create a notification for the admin
            await supabase.from("notifications").insert({
              user_id: user.id,
              title: "New Role Request",
              message: `User ${user.email} has requested the ${requestedRole} role.`,
              is_read: false,
            })

            // Clear the requested role from localStorage
            localStorage.removeItem("requestedRole")
          }
        }

        // Redirect to dashboard
        router.push("/dashboard")
      } catch (error) {
        console.error("Error handling registration:", error)
      } finally {
        setLoading(false)
      }
    }

    handleRegistration()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Setting up your account...</span>
      </div>
    )
  }

  return null
}
