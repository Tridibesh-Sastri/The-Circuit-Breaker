"use client"

import { createServerClient } from "@/lib/supabase-server"
import { createClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

// Enhanced user profile type
export interface EnhancedProfile {
  id: string
  username: string
  full_name: string | null
  email: string
  avatar_url: string | null
  role: "member" | "alumni" | "admin" | "moderator"
  status: "active" | "inactive" | "suspended" | "pending"
  bio: string | null
  department: string | null
  year_of_study: string | null
  graduation_year: number | null
  phone: string | null
  linkedin_url: string | null
  github_url: string | null
  points: number
  email_verified: boolean
  profile_completed: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

// Role hierarchy for permission checking
const ROLE_HIERARCHY = {
  member: 0,
  alumni: 1,
  moderator: 2,
  admin: 3,
}

// Permission definitions
export const PERMISSIONS = {
  // Content permissions
  CREATE_PROJECT: "create_project",
  EDIT_OWN_PROJECT: "edit_own_project",
  EDIT_ANY_PROJECT: "edit_any_project",
  DELETE_PROJECT: "delete_project",
  APPROVE_PROJECT: "approve_project",

  // Event permissions
  CREATE_EVENT: "create_event",
  EDIT_EVENT: "edit_event",
  DELETE_EVENT: "delete_event",
  MANAGE_REGISTRATIONS: "manage_registrations",

  // Forum permissions
  CREATE_POST: "create_post",
  EDIT_OWN_POST: "edit_own_post",
  EDIT_ANY_POST: "edit_any_post",
  DELETE_POST: "delete_post",
  MODERATE_FORUM: "moderate_forum",

  // User management permissions
  VIEW_USERS: "view_users",
  EDIT_USER_ROLES: "edit_user_roles",
  SUSPEND_USERS: "suspend_users",
  VIEW_AUDIT_LOGS: "view_audit_logs",

  // Resource permissions
  UPLOAD_RESOURCE: "upload_resource",
  APPROVE_RESOURCE: "approve_resource",
  DELETE_RESOURCE: "delete_resource",
} as const

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  member: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_OWN_PROJECT,
    PERMISSIONS.CREATE_EVENT,
    PERMISSIONS.CREATE_POST,
    PERMISSIONS.EDIT_OWN_POST,
    PERMISSIONS.UPLOAD_RESOURCE,
  ],
  alumni: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_OWN_PROJECT,
    PERMISSIONS.CREATE_EVENT,
    PERMISSIONS.EDIT_EVENT,
    PERMISSIONS.CREATE_POST,
    PERMISSIONS.EDIT_OWN_POST,
    PERMISSIONS.UPLOAD_RESOURCE,
    PERMISSIONS.APPROVE_RESOURCE,
  ],
  moderator: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_OWN_PROJECT,
    PERMISSIONS.EDIT_ANY_PROJECT,
    PERMISSIONS.APPROVE_PROJECT,
    PERMISSIONS.CREATE_EVENT,
    PERMISSIONS.EDIT_EVENT,
    PERMISSIONS.DELETE_EVENT,
    PERMISSIONS.MANAGE_REGISTRATIONS,
    PERMISSIONS.CREATE_POST,
    PERMISSIONS.EDIT_OWN_POST,
    PERMISSIONS.EDIT_ANY_POST,
    PERMISSIONS.DELETE_POST,
    PERMISSIONS.MODERATE_FORUM,
    PERMISSIONS.UPLOAD_RESOURCE,
    PERMISSIONS.APPROVE_RESOURCE,
    PERMISSIONS.DELETE_RESOURCE,
    PERMISSIONS.VIEW_USERS,
  ],
  admin: Object.values(PERMISSIONS),
}

// Enhanced authentication functions
export class AuthService {
  private supabase: ReturnType<typeof createServerClient>

  constructor(isServer = true) {
    this.supabase = isServer ? createServerClient() : createClient()
  }

  // Get current session with enhanced error handling
  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession()
      if (error) {
        console.error("Session error:", error)
        return null
      }
      return session
    } catch (error) {
      console.error("Failed to get session:", error)
      return null
    }
  }

  // Get enhanced user profile
  async getProfile(userId?: string): Promise<EnhancedProfile | null> {
    try {
      const session = await this.getSession()
      const targetUserId = userId || session?.user?.id

      if (!targetUserId) {
        return null
      }

      const { data: profile, error } = await this.supabase.from("profiles").select("*").eq("id", targetUserId).single()

      if (error) {
        console.error("Profile fetch error:", error)
        return null
      }

      return profile as EnhancedProfile
    } catch (error) {
      console.error("Failed to get profile:", error)
      return null
    }
  }

  // Create or update profile
  async createOrUpdateProfile(userData: Partial<EnhancedProfile>): Promise<EnhancedProfile | null> {
    try {
      const session = await this.getSession()
      if (!session?.user) {
        throw new Error("No authenticated user")
      }

      const { data: profile, error } = await this.supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          email: session.user.email!,
          username: userData.username || session.user.email!.split("@")[0],
          full_name: userData.full_name || session.user.user_metadata?.full_name || "",
          avatar_url: userData.avatar_url || session.user.user_metadata?.avatar_url || "",
          role: userData.role || "member",
          status: userData.status || "active",
          email_verified: session.user.email_confirmed_at !== null,
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Profile upsert error:", error)
        return null
      }

      // Log the profile update
      await this.logUserAction(session.user.id, "profile_updated", "profile", session.user.id, {
        updated_fields: Object.keys(userData),
      })

      return profile as EnhancedProfile
    } catch (error) {
      console.error("Failed to create/update profile:", error)
      return null
    }
  }

  // Check if user has specific permission
  async hasPermission(permission: string, userId?: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId)
      if (!profile) return false

      // Check role-based permissions
      const rolePermissions = ROLE_PERMISSIONS[profile.role] || []
      if (rolePermissions.includes(permission)) {
        return true
      }

      // Check custom permissions
      const { data: customPermissions } = await this.supabase
        .from("user_permissions")
        .select("permission")
        .eq("user_id", profile.id)
        .eq("permission", permission)
        .or("expires_at.is.null,expires_at.gt.now()")

      return customPermissions && customPermissions.length > 0
    } catch (error) {
      console.error("Permission check error:", error)
      return false
    }
  }

  // Check if user has minimum role level
  hasMinimumRole(userRole: string, requiredRole: string): boolean {
    const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] ?? -1
    const requiredLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] ?? 999
    return userLevel >= requiredLevel
  }

  // Get role-based dashboard route
  getRoleDashboardRoute(role: string): string {
    switch (role) {
      case "admin":
        return "/dashboard/admin"
      case "moderator":
        return "/dashboard/admin" // Moderators use admin dashboard with limited access
      case "alumni":
        return "/dashboard/alumni"
      case "member":
      default:
        return "/dashboard/member"
    }
  }

  // Enhanced role-based redirection
  async redirectToRoleDashboard(profile?: EnhancedProfile) {
    try {
      const userProfile = profile || (await this.getProfile())

      if (!userProfile) {
        redirect("/auth?error=no_profile")
        return
      }

      // Check if profile is complete
      if (!userProfile.profile_completed) {
        redirect("/dashboard/profile/complete")
        return
      }

      // Check account status
      if (userProfile.status === "suspended") {
        redirect("/auth?error=account_suspended")
        return
      }

      if (userProfile.status === "pending") {
        redirect("/auth?error=account_pending")
        return
      }

      // Redirect to appropriate dashboard
      const dashboardRoute = this.getRoleDashboardRoute(userProfile.role)
      redirect(dashboardRoute)
    } catch (error) {
      console.error("Redirection error:", error)
      redirect("/auth?error=redirection_failed")
    }
  }

  // Log user actions for audit trail
  async logUserAction(
    userId: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ) {
    try {
      await this.supabase.rpc("log_user_action", {
        user_uuid: userId,
        action_name: action,
        resource_type_name: resourceType,
        resource_uuid: resourceId,
        action_details: details ? JSON.stringify(details) : null,
        user_ip: ipAddress,
        user_agent_string: userAgent,
      })
    } catch (error) {
      console.error("Failed to log user action:", error)
    }
  }

  // Create notification for user
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
    actionUrl?: string,
  ) {
    try {
      await this.supabase.rpc("create_notification", {
        user_uuid: userId,
        notification_title: title,
        notification_message: message,
        notification_type: type,
        action_url_param: actionUrl,
      })
    } catch (error) {
      console.error("Failed to create notification:", error)
    }
  }

  // Request role change
  async requestRoleChange(requestedRole: "alumni" | "moderator", reason: string, supportingDocuments?: string[]) {
    try {
      const session = await this.getSession()
      const profile = await this.getProfile()

      if (!session?.user || !profile) {
        throw new Error("Authentication required")
      }

      const { data, error } = await this.supabase
        .from("role_requests")
        .insert({
          user_id: session.user.id,
          current_role: profile.role,
          requested_role: requestedRole,
          request_reason: reason,
          supporting_documents: supportingDocuments || [],
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Log the role request
      await this.logUserAction(session.user.id, "role_change_requested", "role_request", data.id, {
        requested_role: requestedRole,
        current_role: profile.role,
      })

      // Notify admins about the role request
      const { data: admins } = await this.supabase.from("profiles").select("id").eq("role", "admin")

      if (admins) {
        for (const admin of admins) {
          await this.createNotification(
            admin.id,
            "New Role Request",
            `${profile.full_name || profile.username} has requested to become ${requestedRole}`,
            "info",
            "/dashboard/admin/users",
          )
        }
      }

      return data
    } catch (error) {
      console.error("Role request error:", error)
      throw error
    }
  }
}

// Server-side authentication helpers
export async function requireAuth() {
  const authService = new AuthService(true)
  const session = await authService.getSession()

  if (!session) {
    redirect("/auth")
  }

  return session
}

export async function requireRole(requiredRole: string) {
  const session = await requireAuth()
  const authService = new AuthService(true)
  const profile = await authService.getProfile(session.user.id)

  if (!profile) {
    redirect("/auth?error=no_profile")
  }

  if (!authService.hasMinimumRole(profile.role, requiredRole)) {
    redirect("/dashboard?error=insufficient_permissions")
  }

  return { session, profile }
}

export async function requirePermission(permission: string) {
  const session = await requireAuth()
  const authService = new AuthService(true)
  const hasPermission = await authService.hasPermission(permission, session.user.id)

  if (!hasPermission) {
    redirect("/dashboard?error=insufficient_permissions")
  }

  return session
}

// Client-side authentication hook
export function useAuth() {
  const authService = new AuthService(false)
  return authService
}
