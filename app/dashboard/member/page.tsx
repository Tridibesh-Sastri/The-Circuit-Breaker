import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircuitBackground } from "@/components/circuit-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCard } from "@/components/projects/project-card"
import { EventCard } from "@/components/events/event-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function MemberDashboard() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return null
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Fetch recent projects
  const { data: recentProjects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

  // Fetch upcoming events
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .gt("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(3)

  return (
    <div className="relative min-h-screen">
      <CircuitBackground className="fixed inset-0 z-0 opacity-5" />
      <div className="relative z-10 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Welcome, {profile?.full_name || "Member"}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Your electronics projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{profile?.projects_count || 0}</p>
              <p className="text-sm text-muted-foreground">Projects submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>Events you've attended</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{profile?.events_attended || 0}</p>
              <p className="text-sm text-muted-foreground">Events attended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Points</CardTitle>
              <CardDescription>Your contribution points</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{profile?.points || 0}</p>
              <p className="text-sm text-muted-foreground">Total points earned</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="mb-8">
          <TabsList>
            <TabsTrigger value="projects">Recent Projects</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Link href="/dashboard/projects/new">
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProjects && recentProjects.length > 0 ? (
                recentProjects.map((project) => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-muted-foreground">No projects found. Create your first project!</p>
                  <Link href="/dashboard/projects/new" className="mt-4 inline-block">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <Link href="/dashboard/projects">
                <Button variant="outline">View All Projects</Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              <Link href="/dashboard/events">
                <Button variant="outline" size="sm">
                  View Calendar
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents && upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-muted-foreground">No upcoming events found.</p>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <Link href="/dashboard/events">
                <Button variant="outline">View All Events</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
