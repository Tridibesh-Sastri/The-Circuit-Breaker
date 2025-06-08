"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, MapPin, Award, BookOpen } from "lucide-react"

interface Workshop {
  id: string
  title: string
  description: string
  instructor: string
  date: string
  time: string
  duration: number
  capacity: number
  enrolled: number
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  materials: string[]
  prerequisites: string[]
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  location: string
  image?: string
  skills: string[]
  certificateEligible: boolean
}

interface WorkshopCardProps {
  workshop: Workshop
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const enrollmentPercentage = (workshop.enrolled / workshop.capacity) * 100

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getLevelColor(workshop.level)}>{workshop.level}</Badge>
          <Badge className={getStatusColor(workshop.status)}>{workshop.status}</Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{workshop.title}</CardTitle>
        <CardDescription className="line-clamp-2">{workshop.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Instructor */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="h-4 w-4" />
          <span>{workshop.instructor}</span>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(workshop.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {workshop.time} ({workshop.duration}min)
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{workshop.location}</span>
        </div>

        {/* Enrollment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Enrollment</span>
            </div>
            <span className="font-medium">
              {workshop.enrolled}/{workshop.capacity}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${enrollmentPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Skills you'll learn:</p>
          <div className="flex flex-wrap gap-1">
            {workshop.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {workshop.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{workshop.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Certificate Eligible */}
        {workshop.certificateEligible && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Award className="h-4 w-4" />
            <span>Certificate eligible</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {workshop.status === "upcoming" && (
            <Button className="w-full" disabled={workshop.enrolled >= workshop.capacity}>
              {workshop.enrolled >= workshop.capacity ? "Workshop Full" : "Register"}
            </Button>
          )}
          {workshop.status === "ongoing" && (
            <Button className="w-full" variant="outline">
              Join Session
            </Button>
          )}
          {workshop.status === "completed" && (
            <Button className="w-full" variant="outline">
              View Materials
            </Button>
          )}
          {workshop.status === "cancelled" && (
            <Button className="w-full" variant="outline" disabled>
              Cancelled
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
