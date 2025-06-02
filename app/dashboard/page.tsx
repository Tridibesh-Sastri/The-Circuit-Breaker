"use client"

import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth/auth-guard"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ProjectStatus } from "@/components/dashboard/project-status"

export default function DashboardPage() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {profile?.full_name || profile?.username || "Member"}!
          </h1>
          <p className="text-gray-400 mt-2">Here's what's happening in the Circuit Breaker community.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Active Projects" value="12" change="+2 from last month" trend="up" />
          <StatsCard title="Upcoming Events" value="3" change="Next: Workshop on Friday" trend="neutral" />
          <StatsCard
            title="Community Points"
            value={profile?.points?.toString() || "0"}
            change="Keep participating!"
            trend="up"
          />
          <StatsCard title="Your Role" value={profile?.role || "Member"} change="Active member" trend="neutral" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <ProjectStatus />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <UpcomingEvents />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
