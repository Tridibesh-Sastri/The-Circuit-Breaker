"use client"

import { useState } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { ProjectStatus } from "@/components/dashboard/project-status"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  BookOpen,
  Calendar,
  Wrench,
  Bell,
  UserPlus,
  FileText,
  Settings,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - in a real app, this would come from your database
  const stats = [
    {
      title: "Total Members",
      value: "124",
      icon: <Users className="h-4 w-4" />,
      trend: { value: 12, isPositive: true, text: "from last month" },
    },
    {
      title: "Library Resources",
      value: "87",
      icon: <BookOpen className="h-4 w-4" />,
      trend: { value: 8, isPositive: true, text: "from last month" },
    },
    {
      title: "Upcoming Events",
      value: "6",
      icon: <Calendar className="h-4 w-4" />,
      trend: { value: 2, isPositive: true, text: "from last month" },
    },
    {
      title: "Active Projects",
      value: "15",
      icon: <Wrench className="h-4 w-4" />,
      trend: { value: 3, isPositive: false, text: "from last month" },
    },
  ]

  const activities = [
    {
      id: "1",
      user: { name: "Alex Chen", initials: "AC" },
      action: "submitted a new project",
      target: "Smart Home Automation",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      user: { name: "Priya Sharma", initials: "PS" },
      action: "requested to join as",
      target: "Member",
      timestamp: "4 hours ago",
    },
    {
      id: "3",
      user: { name: "Michael Johnson", initials: "MJ" },
      action: "uploaded a resource",
      target: "PCB Design Guide",
      timestamp: "Yesterday",
    },
    {
      id: "4",
      user: { name: "Emma Wilson", initials: "EW" },
      action: "commented on",
      target: "Gesture Controlled Robot",
      timestamp: "Yesterday",
    },
    {
      id: "5",
      user: { name: "David Kumar", initials: "DK" },
      action: "registered for",
      target: "PCB Design Workshop",
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
      team: ["AC", "PS", "MJ"],
    },
    {
      id: "2",
      name: "Gesture Controlled Robot",
      progress: 90,
      status: "review",
      team: ["EW", "DK"],
    },
    {
      id: "3",
      name: "Solar Powered Weather Station",
      progress: 40,
      status: "planning",
      team: ["MJ", "AC"],
    },
  ]

  const quickActions = [
    {
      id: "1",
      label: "Add Member",
      icon: <UserPlus className="h-full w-full" />,
      onClick: () => router.push("/dashboard/admin/users"),
    },
    {
      id: "2",
      label: "Add Resource",
      icon: <FileText className="h-full w-full" />,
      onClick: () => router.push("/dashboard/library/new"),
    },
    {
      id: "3",
      label: "Create Event",
      icon: <PlusCircle className="h-full w-full" />,
      onClick: () => router.push("/dashboard/events/new"),
    },
    {
      id: "4",
      label: "Settings",
      icon: <Settings className="h-full w-full" />,
      onClick: () => router.push("/dashboard/admin/settings"),
    },
  ]

  const pendingApprovals = [
    {
      id: "1",
      type: "Role Request",
      user: "Priya Sharma",
      details: "Requested to join as Member",
      date: "Today",
    },
    {
      id: "2",
      type: "Project Submission",
      user: "Alex Chen",
      details: "Smart Home Automation System",
      date: "Yesterday",
    },
    {
      id: "3",
      type: "Resource Upload",
      user: "Michael Johnson",
      details: "PCB Design Guide",
      date: "2 days ago",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {item.type === "Role Request" ? (
                          <UserPlus className="h-5 w-5 text-primary" />
                        ) : item.type === "Project Submission" ? (
                          <Wrench className="h-5 w-5 text-primary" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.user} - {item.details}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">
                        <AlertCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Member Growth Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mb-2" />
                <p>Analytics charts would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Member Management</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center text-muted-foreground">
                <Users className="h-16 w-16 mb-2" />
                <p>Member management interface would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
