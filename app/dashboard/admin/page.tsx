import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { ProjectStatus } from "@/components/dashboard/project-status"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, BookOpen, Calendar, Cpu } from "lucide-react"
import { PendingApprovals } from "@/components/admin/pending-approvals"
import { MemberManagement } from "@/components/admin/member-management"
import { ClubAnalytics } from "@/components/admin/club-analytics"
import { AuthGuard } from "@/components/auth/auth-guard"

export default async function AdminDashboard() {
  // In testing mode, we'll use mock data
  // In production, we would fetch this data from Supabase

  const stats = [
    {
      title: "Total Members",
      value: "124",
      change: "+12% from last month",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Resources",
      value: "87",
      change: "+5 new this week",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      title: "Events",
      value: "12",
      change: "3 upcoming",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Projects",
      value: "38",
      change: "8 in progress",
      icon: <Cpu className="h-4 w-4" />,
    },
  ]

  const activities = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      action: "submitted a new project",
      target: "Arduino Weather Station",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      action: "requested role change to",
      target: "Alumni",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      action: "uploaded a new resource",
      target: "PCB Design Guidelines",
      timestamp: "1 day ago",
    },
    {
      id: 4,
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      action: "registered for event",
      target: "Summer Electronics Workshop",
      timestamp: "2 days ago",
    },
  ]

  const events = [
    {
      id: 1,
      title: "PCB Design Workshop",
      date: "May 25, 2023",
      time: "2:00 PM - 4:00 PM",
      location: "Engineering Building, Room 302",
      attendees: 18,
    },
    {
      id: 2,
      title: "Robotics Competition Prep",
      date: "June 5, 2023",
      time: "3:30 PM - 6:00 PM",
      location: "Robotics Lab",
      attendees: 12,
    },
    {
      id: 3,
      title: "Guest Lecture: IoT Innovations",
      date: "June 12, 2023",
      time: "1:00 PM - 2:30 PM",
      location: "Auditorium",
      attendees: 45,
    },
  ]

  const projects = [
    {
      id: 1,
      name: "Smart Home Automation",
      progress: 75,
      status: "In Progress",
      members: 4,
    },
    {
      id: 2,
      name: "Drone Build",
      progress: 40,
      status: "In Progress",
      members: 6,
    },
    {
      id: 3,
      name: "LED Cube Display",
      progress: 90,
      status: "Review",
      members: 2,
    },
    {
      id: 4,
      name: "Solar Powered Charger",
      progress: 60,
      status: "In Progress",
      members: 3,
    },
  ]

  const quickActions = [
    {
      title: "Approve Role Requests",
      description: "3 pending requests",
      href: "/dashboard/admin/users",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Review Project Submissions",
      description: "5 new submissions",
      href: "/dashboard/projects",
      icon: <Cpu className="h-5 w-5" />,
    },
    {
      title: "Approve Resource Uploads",
      description: "2 pending approvals",
      href: "/dashboard/library",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Manage Upcoming Events",
      description: "3 events this month",
      href: "/dashboard/events",
      icon: <Calendar className="h-5 w-5" />,
    },
  ]

  // Mock data for pending approvals
  const pendingApprovals = {
    projects: [
      {
        id: "proj-1",
        title: "Arduino-based Smart Garden",
        submittedBy: "Alex Johnson",
        submittedAt: "2023-05-18T14:30:00Z",
        type: "project",
      },
      {
        id: "proj-2",
        title: "Raspberry Pi Security Camera",
        submittedBy: "Maria Garcia",
        submittedAt: "2023-05-17T09:15:00Z",
        type: "project",
      },
    ],
    resources: [
      {
        id: "res-1",
        title: "Introduction to PCB Design",
        submittedBy: "David Chen",
        submittedAt: "2023-05-19T11:45:00Z",
        type: "resource",
      },
      {
        id: "res-2",
        title: "Microcontroller Programming Guide",
        submittedBy: "Sarah Williams",
        submittedAt: "2023-05-16T16:20:00Z",
        type: "resource",
      },
    ],
    roleRequests: [
      {
        id: "role-1",
        user: "Michael Brown",
        currentRole: "member",
        requestedRole: "mentor",
        requestedAt: "2023-05-18T10:00:00Z",
        type: "role",
      },
      {
        id: "role-2",
        user: "Jennifer Lee",
        currentRole: "member",
        requestedRole: "alumni",
        requestedAt: "2023-05-15T14:10:00Z",
        type: "role",
      },
      {
        id: "role-3",
        user: "Robert Taylor",
        currentRole: "member",
        requestedRole: "mentor",
        requestedAt: "2023-05-14T09:30:00Z",
        type: "role",
      },
    ],
  }

  // Mock data for members
  const members = [
    {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      joinDate: "2022-01-15",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Electrical Engineering",
      yearOfStudy: "3rd Year",
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "mentor",
      joinDate: "2022-02-20",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Computer Science",
      yearOfStudy: "4th Year",
    },
    {
      id: "user-3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      role: "member",
      joinDate: "2022-03-10",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Electronics Engineering",
      yearOfStudy: "2nd Year",
    },
    {
      id: "user-4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      role: "member",
      joinDate: "2022-04-05",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Mechanical Engineering",
      yearOfStudy: "3rd Year",
    },
    {
      id: "user-5",
      name: "David Chen",
      email: "david.chen@example.com",
      role: "alumni",
      joinDate: "2021-05-12",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Electrical Engineering",
      yearOfStudy: "Graduated",
    },
    {
      id: "user-6",
      name: "Emily Taylor",
      email: "emily.taylor@example.com",
      role: "member",
      joinDate: "2022-06-18",
      status: "inactive",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Computer Science",
      yearOfStudy: "1st Year",
    },
    {
      id: "user-7",
      name: "Robert Brown",
      email: "robert.brown@example.com",
      role: "member",
      joinDate: "2022-07-22",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Electronics Engineering",
      yearOfStudy: "2nd Year",
    },
    {
      id: "user-8",
      name: "Jennifer Lee",
      email: "jennifer.lee@example.com",
      role: "member",
      joinDate: "2022-08-30",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Electrical Engineering",
      yearOfStudy: "3rd Year",
    },
  ]

  // Mock data for analytics
  const analyticsData = {
    memberGrowth: [
      { month: "Jan", count: 85 },
      { month: "Feb", count: 92 },
      { month: "Mar", count: 97 },
      { month: "Apr", count: 105 },
      { month: "May", count: 112 },
      { month: "Jun", count: 118 },
      { month: "Jul", count: 124 },
    ],
    eventAttendance: [
      { name: "PCB Workshop", attendance: 28 },
      { name: "Arduino Basics", attendance: 35 },
      { name: "Robotics Demo", attendance: 42 },
      { name: "IoT Seminar", attendance: 30 },
      { name: "Soldering Class", attendance: 25 },
    ],
    resourceUsage: [
      { category: "Tutorials", count: 45 },
      { category: "Datasheets", count: 30 },
      { category: "Books", count: 15 },
      { category: "Question Papers", count: 25 },
    ],
    projectCategories: [
      { category: "Arduino", count: 12 },
      { category: "Raspberry Pi", count: 8 },
      { category: "IoT", count: 10 },
      { category: "Robotics", count: 6 },
      { category: "Other", count: 2 },
    ],
    forumActivity: [
      { day: "Mon", posts: 5, comments: 12 },
      { day: "Tue", posts: 8, comments: 20 },
      { day: "Wed", posts: 12, comments: 25 },
      { day: "Thu", posts: 6, comments: 15 },
      { day: "Fri", posts: 9, comments: 18 },
      { day: "Sat", posts: 4, comments: 10 },
      { day: "Sun", posts: 3, comments: 8 },
    ],
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <StatsCard key={index} title={stat.title} value={stat.value} change={stat.change} icon={stat.icon} />
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions from club members</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityFeed activities={activities} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <QuickActions actions={quickActions} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events scheduled in the next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingEvents events={events} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Status</CardTitle>
                  <CardDescription>Current projects and their progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectStatus projects={projects} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="approvals">
            <PendingApprovals pendingApprovals={pendingApprovals} />
          </TabsContent>

          <TabsContent value="members">
            <MemberManagement members={members} />
          </TabsContent>

          <TabsContent value="analytics">
            <ClubAnalytics data={analyticsData} />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
