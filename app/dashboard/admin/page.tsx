import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircuitBackground } from "@/components/circuit-background"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Calendar, BookOpen, MessageSquare, AlertCircle } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return null
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Fetch counts
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: pendingRoleRequestsCount } = await supabase
    .from("role_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: projectsCount } = await supabase.from("projects").select("*", { count: "exact", head: true })

  const { count: eventsCount } = await supabase.from("events").select("*", { count: "exact", head: true })

  return (
    <div className="relative min-h-screen">
      <CircuitBackground className="fixed inset-0 z-0 opacity-5" />
      <div className="relative z-10 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount || 0}</div>
              <p className="text-xs text-muted-foreground">Registered members and alumni</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRoleRequestsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Role requests awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Projects submitted by members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Events organized by the club</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage club resources</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/admin/users">
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>

              <Link href="/dashboard/events/new">
                <Button className="w-full" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </Link>

              <Link href="/dashboard/projects">
                <Button className="w-full" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Projects
                </Button>
              </Link>

              <Link href="/dashboard/forum">
                <Button className="w-full" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Forum
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Role Requests</CardTitle>
              <CardDescription>Users waiting for role approval</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRoleRequestsCount && pendingRoleRequestsCount > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm">
                    You have {pendingRoleRequestsCount} pending role requests that need your attention.
                  </p>
                  <Link href="/dashboard/admin/users">
                    <Button>Review Requests</Button>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No pending role requests at this time.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
