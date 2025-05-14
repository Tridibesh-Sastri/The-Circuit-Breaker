import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircuitBackground } from "@/components/circuit-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCard } from "@/components/projects/project-card"
import { EventCard } from "@/components/events/event-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Briefcase, GraduationCap, Users } from "lucide-react"

export default async function AlumniDashboard() {
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

  // Fetch other alumni
  const { data: otherAlumni } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "alumni")
    .neq("id", session.user.id)
    .limit(5)

  return (
    <div className="relative min-h-screen">
      <CircuitBackground className="fixed inset-0 z-0 opacity-5" />
      <div className="relative z-10 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Welcome, {profile?.full_name || "Alumni"}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alumni Status</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Alumni</div>
              <p className="text-xs text-muted-foreground">Graduated member with special access</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contributions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.projects_count || 0}</div>
              <p className="text-xs text-muted-foreground">Projects contributed to the club</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Industry</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.industry || "Not specified"}</div>
              <p className="text-xs text-muted-foreground">Current industry or field</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="mb-8">
          <TabsList>
            <TabsTrigger value="projects">Recent Projects</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="network">Alumni Network</TabsTrigger>
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
                  <p className="text-muted-foreground">No projects found. Share your industry experience!</p>
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

          <TabsContent value="network" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Alumni Network</h2>
              <Link href="/dashboard/alumni/network">
                <Button variant="outline" size="sm">
                  View All Alumni
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherAlumni && otherAlumni.length > 0 ? (
                otherAlumni.map((alumni) => (
                  <Card key={alumni.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {alumni.avatar_url ? (
                            <img
                              src={alumni.avatar_url || "/placeholder.svg"}
                              alt={alumni.full_name || "Alumni"}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <Users className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{alumni.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{alumni.industry || "Alumni"}</p>
                        </div>
                      </div>
                      {alumni.bio && <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{alumni.bio}</p>}
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-muted-foreground">No other alumni found in the network.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
