"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CircuitBackground } from "@/components/circuit-background"
import { Loader2, User, GraduationCap, Building, FileText } from "lucide-react"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
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

        // Check if user already has a profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          // Profile already exists, redirect to dashboard
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Setup auth check error:", error)
      }
    }

    checkAuth()
  }, [router])

  const handleSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const fullName = formData.get("fullName") as string
    const department = formData.get("department") as string
    const yearOfStudy = formData.get("yearOfStudy") as string
    const bio = formData.get("bio") as string

    try {
      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        username,
        full_name: fullName,
        department,
        year_of_study: yearOfStudy,
        bio: bio || null,
        role: "member", // Default role
        points: 0,
      })

      if (profileError) {
        if (profileError.code === "23505") {
          setError("Username already taken. Please choose a different one.")
        } else {
          setError(profileError.message)
        }
        return
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Profile setup error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <CircuitBackground />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Tell us a bit about yourself to get started</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle>Profile Setup</CardTitle>
            <CardDescription>This information will be visible to other club members</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a unique username"
                    className="pl-10"
                    required
                    disabled={isLoading}
                    pattern="^[a-zA-Z0-9_]+$"
                    title="Username can only contain letters, numbers, and underscores"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    required
                    disabled={isLoading}
                    defaultValue={user.user_metadata?.full_name || ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <Select name="department" required disabled={isLoading}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="electrical">Electrical Engineering</SelectItem>
                      <SelectItem value="electronics">Electronics Engineering</SelectItem>
                      <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                      <SelectItem value="civil">Civil Engineering</SelectItem>
                      <SelectItem value="chemical">Chemical Engineering</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearOfStudy">Year of Study</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <Select name="yearOfStudy" required disabled={isLoading}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st-year">1st Year</SelectItem>
                      <SelectItem value="2nd-year">2nd Year</SelectItem>
                      <SelectItem value="3rd-year">3rd Year</SelectItem>
                      <SelectItem value="4th-year">4th Year</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about your interests in electronics..."
                    className="pl-10 min-h-[80px]"
                    disabled={isLoading}
                    maxLength={500}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up profile...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
