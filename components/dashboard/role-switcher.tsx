"use client"

import { useState } from "react"
import { Shield, User, GraduationCap } from "lucide-react"
import Link from "next/link"

export function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-colors"
      >
        <span className="mr-2">Switch Role</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
          <Link
            href="/dashboard/admin"
            className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Link>
          <Link
            href="/dashboard/member"
            className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <User className="mr-2 h-4 w-4" />
            Member Dashboard
          </Link>
          <Link
            href="/dashboard/alumni"
            className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Alumni Dashboard
          </Link>
        </div>
      )}
    </div>
  )
}
