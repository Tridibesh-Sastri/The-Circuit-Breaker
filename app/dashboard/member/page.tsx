"use client"

import { useState } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { ProjectStatus } from "@/components/dashboard/project-status"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Wrench, Bell, PlusCircle, MessageSquare, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function MemberDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - in a real app, this would come from your database
  const stats = [
    {
      title: "My Projects",
      value: "3",
      icon: <Wrench className="h-4 w-4" />,
      trend: { value: 1, isPositive: true, text: "from last month" },
    },
    {
      title: "Events Attended",
      value: "7",
      icon: <Calendar className="h-4 w-4" />,
      trend: { value: 2, isPositive: true, text: "from last month" },
    },
    {
      title: "Resources Accessed",
      value: "24",
      icon: <BookOpen className="h-4 w-4" />,
      trend: { value: 5, isPositive: true, text: "from last month" },
    },
    {
      title: "Forum Posts",
      value: "12",
      icon: <MessageSquare className="h-4 w-4" />,
      trend: { value: 3, isPositive: true, text: "from last month" },
    },
  ]

  const activities = [
    {
      id: "1",
      user: { name: "You", initials: "YO" },
      action: "commented on",
      target: "Gesture Controlled Robot",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      user: { name: "Alex Chen", initials: "AC" },
      action: "replied to your comment on",
      target: "Smart Home Automation",
      timestamp: "4 hours ago",
    },
    {
      id: "3",
      user: { name: "Emma Wilson", initials: "EW" },
      action: "invited you to collaborate on",
      target: "Solar Powered Weather Station",
      timestamp: "Yesterday",
    },
    {
      id: "4",
      user: { name: "Club Admin", initials: "CA" },
      action: "announced a new event",
      target: "PCB Design Workshop",
      timestamp: "Yesterday",
    },
    {
      id: "5",
      user: { name: "You", initials: "YO" },
      action: "registered for",
      target: "Electronics Hackathon",
      timestamp: "2 days ago",
    },
  ]

  const events = [
    {
      id: "1",
      title: "PCB Design Workshop",
      date: "May 15, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Engineering Building, Room 302",
      type: "workshop",
    },
    {
      id: "2",
      title: "Electronics Hackathon",
      date: "June 10-12, 2025",
      time: "9:00 AM - 6:00 PM",
      location: "Innovation Center",
      type: "competition",
    },
    {
      id: "3",
      title: "Monthly Club Meeting",
      date: "May 5, 2025",
      time: "6:00 PM - 7:30 PM",
      location: "Engineering Building, Room 105",
      type: "meetup",
    },
  ]

  const projects = [
    {
      id: "1",
      name: "Smart Home Automation System",
      progress: 75,
      status: "in-progress",
      team: ["YO", "PS", "MJ"],
    },
    {
      id: "2",
      name: "Gesture Controlled Robot",
      progress: 30,
      status: "planning",
      team: ["YO", "EW"],
    },
    {
      id: "3",
      name: "Solar Powered Weather Station",
      progress: 10,
      status: "planning",
      team: ["MJ", "YO", "AC"],
    },
  ]

  const quickActions = [
    {
      id: "1",
      label: "New Project",
      icon: <PlusCircle className="h-full w-full" />,
      onClick: () => router.push("/dashboard/projects/new"),
    },
    {
      id: "2",
      label: "Browse Library",
      icon: <BookOpen className="h-full w-full" />,
      onClick: () => router.push("/dashboard/library"),
    },
    {
      id: "3",
      label: "Forum",
      icon: <MessageSquare className="h-full w-full" />,
      onClick: () => router.push("/dashboard/forum"),
    },
    {
      id: "4",
      label: "Certificates",
      icon: <Award className="h-full w-full" />,
      onClick: () => router.push("/dashboard/certificates"),
    },
  ]

  const learningResources = [
    {
      id: "1",
      title: "PCB Design Fundamentals",
      type: "Tutorial",
      difficulty: "Beginner",
      author: "Prof. Johnson",
    },
    {
      id: "2",
      title: "Arduino Programming Guide",
      type: "E-Book",
      difficulty: "Intermediate",
      author: "Alex Chen",
    },
    {
      id: "3",
      title: "Sensor Integration Techniques",
      type: "Video Course",
      difficulty: "Advanced",
      author: "Emma Wilson",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Member Dashboard</h1>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
            2
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} trend={stat.trend} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActivityFeed activities={activities} className="lg:col-span-2" />
            <QuickActions actions={quickActions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingEvents events={events} />
            <ProjectStatus projects={projects} />
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>My Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-lg">{project.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={
                              project.status === "planning"
                                ? "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20"
                                : project.status === "in-progress"
                                  ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                  : project.status === "review"
                                    ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                    : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            }
                          >
                            {project.status
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Team: {project.team.join(", ")}</span>
                        </div>
                      </div>
                      <button
                        className="text-primary text-sm"
                        onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center">
                  <button
                    className="text-primary flex items-center gap-1"
                    onClick={() => router.push("/dashboard/projects/new")}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Start New Project</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Learning Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningResources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{resource.type}</Badge>
                        <Badge
                          className={
                            resource.difficulty === "Beginner"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : resource.difficulty === "Intermediate"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-rose-500/10 text-rose-500"
                          }
                        >
                          {resource.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">By {resource.author}</p>
                    </div>
                    <button
                      className="text-primary text-sm"
                      onClick={() => router.push(`/dashboard/library/${resource.id}`)}
                    >
                      Access
                    </button>
                  </div>
                ))}
                <div className="flex justify-center">
                  <button
                    className="text-primary flex items-center gap-1"
                    onClick={() => router.push("/dashboard/library")}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Browse All Resources</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
