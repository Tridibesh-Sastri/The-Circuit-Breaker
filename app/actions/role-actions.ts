"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function submitRoleRequest(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  const userId = session.user.id
  const requestedRole = formData.get("role") as string
  const requestReason = formData.get("reason") as string

  if (!requestedRole || !["member", "alumni"].includes(requestedRole)) {
    return { error: "Invalid role requested" }
  }

  // Check if user already has a pending request
  const { data: existingRequests } = await supabase
    .from("role_requests")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending")

  if (existingRequests && existingRequests.length > 0) {
    return { error: "You already have a pending role request" }
  }

  // Insert new role request
  const { error } = await supabase.from("role_requests").insert({
    user_id: userId,
    requested_role: requestedRole,
    request_reason: requestReason,
    status: "pending",
  })

  if (error) {
    console.error("Error submitting role request:", error)
    return { error: "Failed to submit role request" }
  }

  revalidatePath("/dashboard/profile")
  return { success: "Role request submitted successfully" }
}

export async function approveRoleRequest(requestId: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  // Check if user is admin
  const { data: userProfile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (!userProfile || userProfile.role !== "admin") {
    return { error: "Unauthorized" }
  }

  // Get the request details
  const { data: request } = await supabase.from("role_requests").select("*").eq("id", requestId).single()

  if (!request) {
    return { error: "Request not found" }
  }

  // Update the request status
  const { error: updateError } = await supabase
    .from("role_requests")
    .update({
      status: "approved",
      reviewed_by: session.user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId)

  if (updateError) {
    console.error("Error updating role request:", updateError)
    return { error: "Failed to approve role request" }
  }

  // Update the user's role
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      role: request.requested_role,
    })
    .eq("id", request.user_id)

  if (profileError) {
    console.error("Error updating user role:", profileError)
    return { error: "Failed to update user role" }
  }

  // Create a notification for the user
  await supabase.from("notifications").insert({
    user_id: request.user_id,
    title: "Role Request Approved",
    message: `Your request to become a ${request.requested_role} has been approved.`,
  })

  revalidatePath("/dashboard/admin/users")
  return { success: "Role request approved successfully" }
}

export async function rejectRoleRequest(requestId: string, formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  // Check if user is admin
  const { data: userProfile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (!userProfile || userProfile.role !== "admin") {
    return { error: "Unauthorized" }
  }

  const adminNotes = formData.get("adminNotes") as string

  // Get the request details
  const { data: request } = await supabase.from("role_requests").select("*").eq("id", requestId).single()

  if (!request) {
    return { error: "Request not found" }
  }

  // Update the request status
  const { error: updateError } = await supabase
    .from("role_requests")
    .update({
      status: "rejected",
      admin_notes: adminNotes,
      reviewed_by: session.user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId)

  if (updateError) {
    console.error("Error updating role request:", updateError)
    return { error: "Failed to reject role request" }
  }

  // Create a notification for the user
  await supabase.from("notifications").insert({
    user_id: request.user_id,
    title: "Role Request Rejected",
    message: `Your request to become a ${request.requested_role} has been rejected. Reason: ${adminNotes || "No reason provided"}`,
  })

  revalidatePath("/dashboard/admin/users")
  return { success: "Role request rejected successfully" }
}

export async function fetchNotifications() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { notifications: [] }
  }

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching notifications:", error)
    return { notifications: [] }
  }

  return { notifications }
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", session.user.id)

  if (error) {
    console.error("Error marking notification as read:", error)
    return { error: "Failed to mark notification as read" }
  }

  revalidatePath("/dashboard")
  return { success: "Notification marked as read" }
}
