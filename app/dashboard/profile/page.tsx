"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, User } from "lucide-react"
import type { Profile } from "@/lib/supabase"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    department: "",
    year_of_study: "",
  })
  const [roleChangeRequest, setRoleChangeRequest] = useState({
    requested_role: "",
    request_reason: "",
  })
  const [pendingRequest, setPendingRequest] = useState<any>(null)

  useEffect(() => {
    fetchProfile()
    checkPendingRoleRequest()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) {
        router.push("/auth")
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.session.user.id)
        .single()

      if (error) throw error

      setProfile(data)
      setFormData({
        full_name: data.full_name || "",
        username: data.username || "",
        bio: data.bio || "",
        department: data.department || "",
        year_of_study: data.year_of_study || "",
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkPendingRoleRequest = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) return

      const { data, error } = await supabase
        .from("role_requests")
        .select("*")
        .eq("user_id", session.session.user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") throw error

      if (data) {
        setPendingRequest(data)
      }
    } catch (error) {
      console.error("Error checking pending role request:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleRequestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRoleChangeRequest((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const updateProfile = async () => {
    if (!profile) return

    setUpdating(true)
    try {
      let avatarUrl = profile.avatar_url

      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop()
        const fileName = `${profile.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError, data } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath)

        avatarUrl = publicUrlData.publicUrl
      }

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) throw error

      // Update local state
      setProfile((prev) => prev ? {
        ...prev,
        ...formData,
        avatar_url: avatarUrl,
      } : null)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const submitRoleRequest = async () => {
    if (!profile) return
    if (!roleChangeRequest.requested_role || !roleChangeRequest.request_reason) {
      toast({
        title: "Missing information",
        description: "Please select a role and provide a reason for your request",
        variant: "destructive",
      })
      return
    }

    setUpdating(true)
    try {
      // Create role request
      const { error } = await supabase.from("role_requests").insert({
        user_id: profile.id,
        requested_role: roleChangeRequest.requested_role,
        request_reason: roleChangeRequest.request_reason,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Request submitted",
        description: "Your role change request has been submitted for approval",
      })

      // Reset form and refresh pending request
      setRoleChangeRequest({
        requested_role: "",
        request_reason: "",
      })
      checkPendingRoleRequest()
    } catch (error) {
      console.error("Error submitting role request:", error)
      toast({
        title: "Error",
        description: "Failed to submit role request",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-400">Manage your personal information and settings.</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="role">Role Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="mt-6 space-y-6">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Personal Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal details and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={avatarPreview || profile?.avatar_url || ""} 
                      alt={profile?.username || ""}
                    />
                    <AvatarFallback className="bg-gray-700 text-gray-200 text-2xl">
                      {profile?.username?.charAt(0).toUpperCase() || \
                       profile?.full_name?.charAt(Now that we've successfully set up the role request table and made the specified user an admin, let's implement the necessary functionality in the application.

First, let's update the authentication page to include role selection during registration:
