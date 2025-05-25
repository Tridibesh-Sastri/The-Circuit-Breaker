"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createUserProfile } from "@/app/actions/profile-actions"
import { useToast } from "@/hooks/use-toast"

export default function ProfileSetupPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateProfile = async () => {
    setLoading(true)
    try {
      const result = await createUserProfile()

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Profile created successfully!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Complete Your Profile</CardTitle>
          <CardDescription className="text-gray-400">We need to set up your profile to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-400">
            Your profile will be created with default settings. You can update it later in your dashboard.
          </div>

          <Button onClick={handleCreateProfile} disabled={loading} className="w-full">
            {loading ? "Creating Profile..." : "Create Profile"}
          </Button>

          <Button variant="outline" onClick={() => router.push("/auth")} className="w-full">
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
