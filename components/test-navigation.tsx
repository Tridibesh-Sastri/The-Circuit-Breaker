import Link from "next/link"
import { Shield, User, GraduationCap, MessageSquare, BookOpen, Calendar, Zap } from "lucide-react"

export function TestNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 z-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-white mb-4">Testing Navigation</h2>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/dashboard/admin"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </Link>
          <Link
            href="/dashboard/member"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <User className="mr-2 h-4 w-4" />
            Member
          </Link>
          <Link
            href="/dashboard/alumni"
            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Alumni
          </Link>
          <Link
            href="/dashboard/forum"
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Forum
          </Link>
          <Link
            href="/dashboard/library"
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Library
          </Link>
          <Link
            href="/dashboard/events"
            className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </Link>
          <Link
            href="/dashboard/projects"
            className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
          >
            <Zap className="mr-2 h-4 w-4" />
            Projects
          </Link>
        </div>
      </div>
    </div>
  )
}
