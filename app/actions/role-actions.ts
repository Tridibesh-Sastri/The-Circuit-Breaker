"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

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

export async function rejectRoleRequest(requestId: string, adminNotes: string) {
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
