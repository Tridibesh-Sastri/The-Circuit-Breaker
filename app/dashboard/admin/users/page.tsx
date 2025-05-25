import { redirect } from "next/navigation"
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/user-management"
import { RoleRequests } from "@/components/admin/role-requests"
import { AuthGuard } from "@/components/auth/auth-guard"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const supabase = createServerClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Get the user's profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Check if the user is an admin
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-gray-400">Manage users, roles, and permissions.</p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="requests">Role Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-6">
            <Card className="bg-gray-900/60 border-white/10">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="requests" className="mt-6">
            <Card className="bg-gray-900/60 border-white/10">
              <CardHeader>
                <CardTitle>Role Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <RoleRequests />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
