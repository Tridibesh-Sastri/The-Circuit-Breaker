"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDistanceToNow } from "date-fns"

type RoleRequest = {
  id: string
  user_id: string
  requested_role: string
  status: string
  request_reason: string
  admin_notes: string | null
  created_at: string
  updated_at: string
  reviewed_by: string | null
  reviewed_at: string | null
  profiles: {
    full_name: string | null
    username: string | null
    avatar_url: string | null
    role: string
  }
}

export function RoleRequests() {
  const [requests, setRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<RoleRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)

  useEffect(() => {
    fetchRoleRequests()
  }, [])

  const fetchRoleRequests = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("role_requests")
        .select(`
          *,
          profiles:user_id (
            full_name,
            username,
            avatar_url,
            role
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error("Error fetching role requests:", error)
      toast({
        title: "Error",
        description: "Failed to fetch role requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (request: RoleRequest, action: "approve" | "reject") => {
    setSelectedRequest(request)
    setActionType(action)
    setAdminNotes("")
    setDialogOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const adminId = sessionData.session?.user.id

      if (!adminId) {
        throw new Error("Admin ID not found")
      }

      // Update role request status
      const { error: requestError } = await supabase
        .from("role_requests")
        .update({
          status: actionType === "approve" ? "approved" : "rejected",
          admin_notes: adminNotes,
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedRequest.id)

      if (requestError) throw requestError

      // If approved, update user role
      if (actionType === "approve") {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: selectedRequest.requested_role,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedRequest.user_id)

        if (profileError) throw profileError
      }

      // Create notification for the user
      await supabase.from("notifications").insert({
        user_id: selectedRequest.user_id,
        title: actionType === "approve" ? "Role Request Approved" : "Role Request Rejected",
        message:
          actionType === "approve"
            ? `Your request to become a ${selectedRequest.requested_role} has been approved.`
            : `Your request to become a ${selectedRequest.requested_role} has been rejected. Reason: ${adminNotes || "No reason provided"}`,
      })

      // Update local state
      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                status: actionType === "approve" ? "approved" : "rejected",
                admin_notes: adminNotes,
                reviewed_by: adminId,
                reviewed_at: new Date().toISOString(),
                profiles: {
                  ...req.profiles,
                  role: actionType === "approve" ? selectedRequest.requested_role : req.profiles.role,
                },
              }
            : req,
        ),
      )

      toast({
        title: "Success",
        description:
          actionType === "approve"
            ? `Role request approved. User is now a ${selectedRequest.requested_role}.`
            : "Role request rejected.",
      })

      setDialogOpen(false)
    } catch (error) {
      console.error(`Error ${actionType}ing role request:`, error)
      toast({
        title: "Error",
        description: `Failed to ${actionType} role request`,
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-500">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Role Change Requests</h3>
        <Button variant="outline" onClick={fetchRoleRequests} className="border-gray-700 hover:bg-gray-700">
          Refresh
        </Button>
      </div>

      <div className="rounded-md border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-800/50">
            <TableRow className="hover:bg-gray-800/80 border-gray-700">
              <TableHead>User</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Requested Role</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-gray-800/50 border-gray-700">
                <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                  Loading requests...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow className="hover:bg-gray-800/50 border-gray-700">
                <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                  No role requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id} className="hover:bg-gray-800/50 border-gray-700">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={request.profiles.avatar_url || ""} alt={request.profiles.username || ""} />
                        <AvatarFallback className="bg-gray-700 text-gray-200">
                          {request.profiles.username?.charAt(0).toUpperCase() ||
                            request.profiles.full_name?.charAt(0).toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.profiles.full_name || "No name"}</p>
                        <p className="text-sm text-gray-400">@{request.profiles.username || "username"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gray-700 text-gray-300">
                      {request.profiles.role.charAt(0).toUpperCase() + request.profiles.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        request.requested_role === "admin"
                          ? "bg-red-500/20 text-red-500"
                          : request.requested_role === "alumni"
                            ? "bg-purple-500/20 text-purple-500"
                            : "bg-emerald-500/20 text-emerald-500"
                      }
                    >
                      {request.requested_role.charAt(0).toUpperCase() + request.requested_role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={request.request_reason}>
                    {request.request_reason || "No reason provided"}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</TableCell>
                  <TableCell className="text-right">
                    {request.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-500/20"
                          onClick={() => handleAction(request, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500/20"
                          onClick={() => handleAction(request, "reject")}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        {request.admin_notes ? <span title={request.admin_notes}>Notes available</span> : "No notes"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{actionType === "approve" ? "Approve Role Request" : "Reject Role Request"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {actionType === "approve"
                ? `This will change the user's role to ${selectedRequest?.requested_role}.`
                : "Please provide a reason for rejecting this request."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Admin Notes (optional)</label>
              <Textarea
                placeholder="Add notes about this decision..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionType === "approve"
                  ? "bg-emerald-500 hover:bg-emerald-600 text-black"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
