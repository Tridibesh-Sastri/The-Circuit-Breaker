"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, User, GraduationCap } from "lucide-react"

export function RoleSwitcher() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const switchRole = (role: string) => {
    switch (role) {
      case "admin":
        router.push("/dashboard/admin")
        break
      case "member":
        router.push("/dashboard/member")
        break
      case "alumni":
        router.push("/dashboard/alumni")
        break
      default:
        router.push("/dashboard")
    }
    setIsOpen(false)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button onClick={() => setIsOpen(!isOpen)} variant="outline" className="bg-gray-800 text-white hover:bg-gray-700">
        Switch Role
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => switchRole("admin")}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
              role="menuitem"
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </button>
            <button
              onClick={() => switchRole("member")}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
              role="menuitem"
            >
              <User className="mr-2 h-4 w-4" />
              Member Dashboard
            </button>
            <button
              onClick={() => switchRole("alumni")}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
              role="menuitem"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Alumni Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
