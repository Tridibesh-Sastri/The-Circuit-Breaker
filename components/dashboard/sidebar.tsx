"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  Cpu,
  Calendar,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  X,
  Users,
  BarChart,
  Shield,
  Briefcase,
  GraduationCap,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"

interface SidebarProps {
  profile?: any
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const isAdmin = profile?.role === "admin"
  const isAlumni = profile?.role === "alumni"
  const isMember = profile?.role === "member"

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Common navigation items for all users
  const commonNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["member", "admin", "alumni"],
    },
    {
      title: "Library",
      href: "/dashboard/library",
      icon: BookOpen,
      roles: ["member", "admin", "alumni"],
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: Cpu,
      roles: ["member", "admin", "alumni"],
    },
    {
      title: "Events",
      href: "/dashboard/events",
      icon: Calendar,
      roles: ["member", "admin", "alumni"],
    },
    {
      title: "Forum",
      href: "/dashboard/forum",
      icon: MessageSquare,
      roles: ["member", "admin", "alumni"],
    },
    {
      title: "About",
      href: "/dashboard/about",
      icon: Users,
      roles: ["member", "admin", "alumni"],
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
      roles: ["member", "admin", "alumni"],
    },
  ]

  // Role-specific navigation items
  const adminNavItems = [
    {
      title: "Admin Dashboard",
      href: "/dashboard/admin",
      icon: Shield,
      roles: ["admin"],
    },
    {
      title: "User Management",
      href: "/dashboard/admin/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Content Approval",
      href: "/dashboard/admin/approval",
      icon: FileText,
      roles: ["admin"],
    },
    {
      title: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: BarChart,
      roles: ["admin"],
    },
  ]

  const alumniNavItems = [
    {
      title: "Alumni Network",
      href: "/dashboard/alumni",
      icon: GraduationCap,
      roles: ["alumni", "admin"],
    },
    {
      title: "Career Opportunities",
      href: "/dashboard/alumni/careers",
      icon: Briefcase,
      roles: ["alumni", "admin"],
    },
  ]

  // Combine navigation items based on user role
  const navItems = [
    ...commonNavItems,
    ...(isAdmin ? adminNavItems : []),
    ...(isAlumni || isAdmin ? alumniNavItems : []),
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(!open)}
          className="bg-gray-900/80 backdrop-blur-sm border-white/10 text-white hover:bg-gray-800 hover:text-white"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Backdrop */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900/95 backdrop-blur-md border-r border-white/10 transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="font-bold text-black">CB</span>
              </div>
              <span className="font-bold text-xl text-white">Circuit Breaker</span>
            </div>
            <NotificationDropdown />
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile?.username || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-white">
                    {profile?.username?.charAt(0) || profile?.full_name?.charAt(0) || "?"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.full_name || profile?.username || "User"}
                </p>
                <p className="text-xs text-gray-400 capitalize">{profile?.role || "Member"}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems
              .filter((item) => item.roles.includes(profile?.role || "member"))
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
