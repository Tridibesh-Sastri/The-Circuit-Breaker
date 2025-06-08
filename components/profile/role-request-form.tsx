"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RoleRequestFormProps {
  userId: string
  currentRole: string
  onRequestSubmitted: () => void
}

export function RoleRequestForm({ userId, currentRole, onRequestSubmitted }: RoleRequestFormProps) {
  const supabase = createClientComponentClient()
  const [requestedRole, setRequestedRole] = useState<string>("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  // Submit role request
  const submitRequest = async () => {
    if (!requestedRole) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      })
      return
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for your request",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Check if there's already a pending request
      const { data: existingRequests, error: checkError } = await supabase
        .from("role_requests")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "pending")

      if (checkError) throw checkError

      if (existingRequests && existingRequests.length > 0) {
        toast({
          title: "Error",
          description: "You already have a pending role request",
          variant: "destructive",
        })
        return
      }

      // Create the role request
      const { error } = await supabase.from("role_requests").insert({
        user_id: userId,
        requested_role: requestedRole,
        request_reason: reason,
        status: "pending",
      })

      if (error) throw error

      // Create a notification for admins
      // In a real app, you'd want to notify all admins
      // For simplicity, we'll just create a notification for the user
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "Role Request Submitted",
        message: `Your request to become a ${requestedRole} has been submitted and is pending approval.`,
        is_read: false,
      })

      toast({
        title: "Success",
        description: "Your role request has been submitted",
      })

      // Reset form
      setRequestedRole("")
      setReason("")

      // Notify parent component
      onRequestSubmitted()
    } catch (error) {
      console.error("Error submitting role request:", error)
      toast({
        title: "Error",
        description: "Failed to submit role request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Role Change</CardTitle>
        <CardDescription>Request to change your role from {currentRole} to another role.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Requested Role</label>
          <Select value={requestedRole} onValueChange={setRequestedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {currentRole !== "member" && <SelectItem value="member">Member</SelectItem>}
              {currentRole !== "alumni" && <SelectItem value="alumni">Alumni</SelectItem>}
              {currentRole !== "admin" && <SelectItem value="admin">Admin</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Reason for Request</label>
          <Textarea
            placeholder="Please explain why you are requesting this role change..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={submitRequest} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Request
        </Button>
      </CardFooter>
    </Card>
  )
}
