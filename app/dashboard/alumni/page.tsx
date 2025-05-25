"use client"

import { useState } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Calendar,
  MessageSquare,
  Bell,
  FileText,
  Briefcase,
  Users,
  PlusCircle,
  Clock,
  MapPin,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AlumniDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - in a real app, this would come from your database
  const stats = [
    {
      title: "Mentored Projects",
      value: "5",
      icon: <BookOpen className="h-4 w-4" />,
      trend: { value: 2, isPositive: true, text: "from last month" },
    },
    {
      title: "Events Attended",
      value: "12",
      icon: <Calendar className="h-4 w-4" />,
      trend: { value: 1, isPositive: true, text: "from last month" },
    },
    {
      title: "Forum Contributions",
      value: "34",
      icon: <MessageSquare className="h-4 w-4" />,
      trend: { value: 7, isPositive: true, text: "from last month" },
    },
    {
      title: "Resources Shared",
      value: "8",
      icon: <FileText className="h-4 w-4" />,
      trend: { value: 3, isPositive: true, text: "from last month" },
    },
  ]

  const activities = [
    {
      id: "1",
      user: { name: "You", initials: "YO" },
      action: "shared a resource",
      target: "Industry Best Practices",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      user: { name: "Alex Chen", initials: "AC" },
      action: "requested mentorship on",
      target: "Smart Home Automation",
      timestamp: "4 hours ago",
    },
    {
      id: "3",
      user: { name: "Emma Wilson", initials: "EW" },
      action: "thanked you for advice on",
      target: "Career Opportunities",
      timestamp: "Yesterday",
    },
    {
      id: "4",
      user: { name: "Club Admin", initials: "CA" },
      action: "invited you to speak at",
      target: "Alumni Connect Event",
      timestamp: "Yesterday",
    },
    {
      id: "5",
      user: { name: "You", initials: "YO" },
      action: "confirmed attendance for",
      target: "Industry Networking Night",
      timestamp: "2 days ago",
    },
  ]

  const events = [
    {
      id: "1",
      title: "Alumni Connect Event",
      date: "May 20, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Engineering Building, Room 302",
      type: "meetup",
    },
    {
      id: "2",
      title: "Industry Networking Night",
      date: "June 15, 2025",
      time: "7:00 PM - 9:00 PM",
      location: "Innovation Center",
      type: "other",
    },
    {
      id: "3",
      title: "Career Guidance Workshop",
      date: "May 25, 2025",
      time: "5:00 PM - 7:00 PM",
      location: "Virtual (Zoom)",
      type: "workshop",
    },
  ]

  const quickActions = [
    {
      id: "1",
      label: "Share Resource",
      icon: <FileText className="h-full w-full" />,
      onClick: () => router.push("/dashboard/library/new"),
    },
    {
      id: "2",
      label: "Mentor Projects",
      icon: <Users className="h-full w-full" />,
      onClick: () => router.push("/dashboard/projects"),
    },
    {
      id: "3",
      label: "Forum",
      icon: <MessageSquare className="h-full w-full" />,
      onClick: () => router.push("/dashboard/forum"),
    },
    {
      id: "4",
      label: "Job Board",
      icon: <Briefcase className="h-full w-full" />,
      onClick: () => router.push("/dashboard/jobs"),
    },
  ]

  const mentorshipRequests = [
    {
      id: "1",
      student: {
        name: "Alex Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        year: "3rd Year",
      },
      project: "Smart Home Automation System",
      message: "I would appreciate your guidance on IoT integration for my project.",
      date: "2 days ago",
    },
    {
      id: "2",
      student: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        year: "4th Year",
      },
      project: "Gesture Controlled Robot",
      message: "Looking for advice on sensor calibration and motor control.",
      date: "3 days ago",
    },
    {
      id: "3",
      student: {
        name: "Michael Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        year: "2nd Year",
      },
      project: "Solar Powered Weather Station",
      message: "Need help with power management and battery selection.",
      date: "1 week ago",
    },
  ]

  const jobOpportunities = [
    {
      id: "1",
      company: "TechInnovate",
      position: "Electronics Engineer",
      location: "San Francisco, CA",
      type: "Full-time",
    },
    {
      id: "2",
      company: "CircuitSolutions",
      position: "Embedded Systems Developer",
      location: "Boston, MA",
      type: "Full-time",
    },
    {
      id: "3",
      company: "NextGen Electronics",
      position: "Hardware Design Intern",
      location: "Remote",
      type: "Internship",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alumni Dashboard</h1>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
            3
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
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
            <Card>
              <CardHeader>
                <CardTitle>Job Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobOpportunities.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{job.position}</h3>
                      <Badge>{job.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
                    <p className="text-xs text-muted-foreground">{job.location}</p>
                    <div className="mt-3 flex justify-end">
                      <button className="text-primary text-sm">View Details</button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center">
                  <button
                    className="text-primary flex items-center gap-1"
                    onClick={() => router.push("/dashboard/jobs")}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>View All Opportunities</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mentorship">
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mentorshipRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={request.student.avatar || "/placeholder.svg"} alt={request.student.name} />
                        <AvatarFallback>{request.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{request.student.name}</h3>
                          <span className="text-xs text-muted-foreground">{request.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.student.year}</p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Project: {request.project}</p>
                          <p className="text-sm mt-1">{request.message}</p>
                        </div>
                        <div className="mt-4 flex gap-2 justify-end">
                          <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md">
                            Accept
                          </button>
                          <button className="px-3 py-1 text-sm border border-muted rounded-md">Decline</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center">
                  <button
                    className="text-primary flex items-center gap-1"
                    onClick={() => router.push("/dashboard/mentorship")}
                  >
                    <Users className="h-4 w-4" />
                    <span>View All Mentorship Requests</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Job Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Help current students and recent graduates by sharing job opportunities from your company or
                    network.
                  </p>
                  <button
                    className="w-full flex items-center justify-center gap-2 p-4 border border-dashed rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    onClick={() => router.push("/dashboard/jobs/new")}
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>Post New Job Opportunity</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Industry Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge
                          className={
                            event.type === "workshop"
                              ? "bg-blue-500/10 text-blue-500"
                              : event.type === "meetup"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-slate-500/10 text-slate-500"
                          }
                        >
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button className="text-primary text-sm">RSVP</button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
