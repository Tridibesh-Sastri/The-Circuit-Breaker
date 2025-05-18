"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, User, Shield } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
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
  const [roleRequests, setRoleRequests] = useState<any[]>([])

  useEffect(() => {
    fetchProfile()
    checkPendingRoleRequest()
    fetchRoleRequests()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) {
        router.push("/auth")
        return
      }

      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.session.user.id).single()

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

  const fetchRoleRequests = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) return

      const { data, error } = await supabase
        .from("role_requests")
        .select("*")
        .eq("user_id", session.session.user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setRoleRequests(data || [])
    } catch (error) {
      console.error("Error fetching role requests:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleRequestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
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

        const { error: uploadError, data } = await supabase.storage.from("avatars").upload(filePath, avatarFile)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath)

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
      setProfile((prev: any) =>
        prev
          ? {
              ...prev,
              ...formData,
              avatar_url: avatarUrl,
            }
          : null,
      )

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
      fetchRoleRequests()
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-500">Rejected</Badge>
      case "pending":
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>
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
    <div className="max-w-4xl mx-auto space-y-8 p-4">
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
                    <AvatarImage src={avatarPreview || profile?.avatar_url || ""} alt={profile?.username || ""} />
                    <AvatarFallback className="bg-gray-700 text-gray-200 text-2xl">
                      {profile?.username?.charAt(0).toUpperCase() || profile?.full_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded-md transition-colors">
                        Change Avatar
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Full Name</label>
                      <Input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Username</label>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Bio</label>
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Department</label>
                      <Input
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Year of Study</label>
                      <Input
                        name="year_of_study"
                        value={formData.year_of_study}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={updateProfile} disabled={updating}>
                  {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="role" className="mt-6 space-y-6">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Role Management
              </CardTitle>
              <CardDescription className="text-gray-400">View your current role and request changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3 bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Current Role</h3>
                  <Badge
                    className={
                      profile?.role === "admin"
                        ? "bg-red-500/20 text-red-500"
                        : profile?.role === "alumni"
                          ? "bg-purple-500/20 text-purple-500"
                          : "bg-emerald-500/20 text-emerald-500"
                    }
                  >
                    {profile?.role.charAt(0).toUpperCase() + profile?.role.slice(1)}
                  </Badge>
                  <p className="text-sm text-gray-400 mt-4">
                    {profile?.role === "admin"
                      ? "You have administrative privileges to manage users and content."
                      : profile?.role === "alumni"
                        ? "You have alumni status with access to alumni-specific features."
                        : "You are a regular member of the electronics club."}
                  </p>
                </div>

                <div className="w-full md:w-2/3">
                  {pendingRequest ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <h3 className="font-medium text-yellow-400 mb-2">Pending Role Request</h3>
                      <p className="text-sm text-gray-300 mb-4">
                        You have a pending request to change your role to{" "}
                        <strong>{pendingRequest.requested_role}</strong>. This request is awaiting admin approval.
                      </p>
                      <p className="text-xs text-gray-400">
                        Requested {formatDistanceToNow(new Date(pendingRequest.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-medium">Request Role Change</h3>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Requested Role</label>
                        <Select
                          value={roleChangeRequest.requested_role}
                          onValueChange={(value) =>
                            setRoleChangeRequest((prev) => ({ ...prev, requested_role: value }))
                          }
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {profile?.role !== "member" && <SelectItem value="member">Member</SelectItem>}
                            {profile?.role !== "alumni" && <SelectItem value="alumni">Alumni</SelectItem>}
                            {profile?.role !== "admin" && <SelectItem value="admin">Admin</SelectItem>}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Reason for Request</label>
                        <Textarea
                          name="request_reason"
                          value={roleChangeRequest.request_reason}
                          onChange={handleRoleRequestChange}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="Please explain why you are requesting this role change..."
                          rows={4}
                        />
                      </div>
                      <Button onClick={submitRoleRequest} disabled={updating || !roleChangeRequest.requested_role}>
                        {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Request
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {roleRequests.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Request History</h3>
                  <div className="rounded-md border border-gray-700 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Requested Role
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {roleRequests.map((request) => (
                          <tr key={request.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="capitalize">{request.requested_role}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                              {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                            <td className="px-4 py-3 text-sm text-gray-400">{request.admin_notes || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
