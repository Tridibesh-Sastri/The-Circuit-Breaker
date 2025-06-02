"use server"

import { AuthService } from "@/lib/auth-enhanced"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function handleUserRegistration(formData: {
  email: string
  password: string
  fullName: string
  requestedRole: "member" | "alumni"
  requestReason?: string
}) {
  try {
    const authService = new AuthService(true)

    // Get client IP and user agent for logging
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || ""
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const clientIp = forwardedFor?.split(",")[0] || realIp || ""

    // Register user with Supabase Auth
    const { data, error } = await authService.supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          requested_role: formData.requestedRole,
        },
      },
    })

    if (error) {
      console.error("Registration error:", error)
      return { error: error.message }
    }

    if (data.user) {
      // Create enhanced profile
      const profile = await authService.createOrUpdateProfile({
        id: data.user.id,
        username: formData.email.split("@")[0],
        full_name: formData.fullName,
        email: formData.email,
        role: "member", // Default role, will be updated if approved
        status: "active",
        profile_completed: false,
      })

      if (!profile) {
        return { error: "Failed to create user profile" }
      }

      // Log registration
      await authService.logUserAction(
        data.user.id,
        "user_registered",
        "profile",
        data.user.id,
        {
          email: formData.email,
          requested_role: formData.requestedRole,
          registration_method: "email",
        },
        clientIp,
        userAgent,
      )

      // If requesting alumni role, create role request
      if (formData.requestedRole === "alumni" && formData.requestReason) {
        await authService.requestRoleChange("alumni", formData.requestReason)
      }

      return {
        success: true,
        message:
          formData.requestedRole === "alumni"
            ? "Registration successful! Your alumni role request has been submitted for review."
            : "Registration successful! Welcome to The Circuit Breaker.",
      }
    }

    return { error: "Registration failed" }
  } catch (error) {
    console.error("Registration action error:", error)
    return { error: "An unexpected error occurred during registration" }
  }
}

export async function handleUserLogin() {
  try {
    const authService = new AuthService(true)
    const profile = await authService.getProfile()

    if (!profile) {
      redirect("/auth?error=no_profile")
    }

    // Log login
    await authService.logUserAction(profile.id, "user_login", "session", undefined, {
      login_method: "redirect_callback",
    })

    // Update last login time
    await authService.createOrUpdateProfile({
      id: profile.id,
      last_login_at: new Date().toISOString(),
    })

    // Redirect based on role and profile completion
    await authService.redirectToRoleDashboard(profile)
  } catch (error) {
    console.error("Login action error:", error)
    redirect("/auth?error=login_failed")
  }
}

export async function completeUserProfile(formData: {
  bio?: string
  department?: string
  yearOfStudy?: string
  graduationYear?: number
  phone?: string
  linkedinUrl?: string
  githubUrl?: string
}) {
  try {
    const authService = new AuthService(true)
    const session = await authService.getSession()

    if (!session?.user) {
      return { error: "Authentication required" }
    }

    const updatedProfile = await authService.createOrUpdateProfile({
      id: session.user.id,
      bio: formData.bio,
      department: formData.department,
      year_of_study: formData.yearOfStudy,
      graduation_year: formData.graduationYear,
      phone: formData.phone,
      linkedin_url: formData.linkedinUrl,
      github_url: formData.githubUrl,
      profile_completed: true,
    })

    if (!updatedProfile) {
      return { error: "Failed to update profile" }
    }

    // Log profile completion
    await authService.logUserAction(session.user.id, "profile_completed", "profile", session.user.id)

    // Create completion notification
    await authService.createNotification(
      session.user.id,
      "Profile Completed!",
      "Your profile has been successfully completed. You now have full access to all features.",
      "success",
    )

    revalidatePath("/dashboard")

    // Redirect to appropriate dashboard
    await authService.redirectToRoleDashboard(updatedProfile)

    return { success: true }
  } catch (error) {
    console.error("Profile completion error:", error)
    return { error: "Failed to complete profile" }
  }
}

export async function requestRoleChange(
  requestedRole: "alumni" | "moderator",
  reason: string,
  supportingDocuments?: string[],
) {
  try {
    const authService = new AuthService(true)
    const roleRequest = await authService.requestRoleChange(requestedRole, reason, supportingDocuments)

    revalidatePath("/dashboard/profile")

    return {
      success: true,
      message: `Your ${requestedRole} role request has been submitted for review.`,
      requestId: roleRequest.id,
    }
  } catch (error) {
    console.error("Role request error:", error)
    return { error: "Failed to submit role request" }
  }
}

export async function approveRoleRequest(requestId: string, adminNotes?: string) {
  try {
    const authService = new AuthService(true)

    // Verify admin permissions
    const session = await authService.getSession()
    const hasPermission = await authService.hasPermission("edit_user_roles", session?.user.id)

    if (!hasPermission) {
      return { error: "Insufficient permissions" }
    }

    // Get role request details
    const { data: roleRequest, error: fetchError } = await authService.supabase
      .from("role_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (fetchError || !roleRequest) {
      return { error: "Role request not found" }
    }

    // Update role request status
    const { error: updateError } = await authService.supabase
      .from("role_requests")
      .update({
        status: "approved",
        reviewed_by: session!.user.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes,
      })
      .eq("id", requestId)

    if (updateError) {
      return { error: "Failed to update role request" }
    }

    // Update user's role
    const updatedProfile = await authService.createOrUpdateProfile({
      id: roleRequest.user_id,
      role: roleRequest.requested_role,
    })

    if (!updatedProfile) {
      return { error: "Failed to update user role" }
    }

    // Log the approval
    await authService.logUserAction(session!.user.id, "role_request_approved", "role_request", requestId, {
      user_id: roleRequest.user_id,
      new_role: roleRequest.requested_role,
      previous_role: roleRequest.current_role,
    })

    // Notify the user
    await authService.createNotification(
      roleRequest.user_id,
      "Role Request Approved!",
      `Your request to become ${roleRequest.requested_role} has been approved. ${adminNotes ? `Admin notes: ${adminNotes}` : ""}`,
      "success",
    )

    revalidatePath("/dashboard/admin/users")

    return { success: true, message: "Role request approved successfully" }
  } catch (error) {
    console.error("Role approval error:", error)
    return { error: "Failed to approve role request" }
  }
}

export async function rejectRoleRequest(requestId: string, adminNotes: string) {
  try {
    const authService = new AuthService(true)

    // Verify admin permissions
    const session = await authService.getSession()
    const hasPermission = await authService.hasPermission("edit_user_roles", session?.user.id)

    if (!hasPermission) {
      return { error: "Insufficient permissions" }
    }

    // Get role request details
    const { data: roleRequest, error: fetchError } = await authService.supabase
      .from("role_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (fetchError || !roleRequest) {
      return { error: "Role request not found" }
    }

    // Update role request status
    const { error: updateError } = await authService.supabase
      .from("role_requests")
      .update({
        status: "rejected",
        reviewed_by: session!.user.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes,
      })
      .eq("id", requestId)

    if (updateError) {
      return { error: "Failed to update role request" }
    }

    // Log the rejection
    await authService.logUserAction(session!.user.id, "role_request_rejected", "role_request", requestId, {
      user_id: roleRequest.user_id,
      requested_role: roleRequest.requested_role,
      rejection_reason: adminNotes,
    })

    // Notify the user
    await authService.createNotification(
      roleRequest.user_id,
      "Role Request Update",
      `Your request to become ${roleRequest.requested_role} has been reviewed. Admin notes: ${adminNotes}`,
      "warning",
    )

    revalidatePath("/dashboard/admin/users")

    return { success: true, message: "Role request rejected" }
  } catch (error) {
    console.error("Role rejection error:", error)
    return { error: "Failed to reject role request" }
  }
}
