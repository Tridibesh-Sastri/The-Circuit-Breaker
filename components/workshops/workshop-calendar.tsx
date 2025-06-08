"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, Users } from "lucide-react"

interface Workshop {
  id: string
  title: string
  date: string
  time: string
  duration: number
  capacity: number
  enrolled: number
  level: "Beginner" | "Intermediate" | "Advanced"
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  location: string
}

interface WorkshopCalendarProps {
  workshops: Workshop[]
}

export function WorkshopCalendar({ workshops }: WorkshopCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getWorkshopsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return workshops.filter((workshop) => workshop.date === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Workshop Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[150px] text-center">{monthYear}</span>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {days.map((day) => (
              <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2 h-24"></div>
              }

              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              const dayWorkshops = getWorkshopsForDate(date)
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div
                  key={day}
                  className={`p-1 h-24 border border-gray-200 rounded-lg ${
                    isToday ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>{day}</div>
                  <div className="space-y-1">
                    {dayWorkshops.slice(0, 2).map((workshop) => (
                      <div
                        key={workshop.id}
                        className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                        title={workshop.title}
                      >
                        {workshop.time} - {workshop.title}
                      </div>
                    ))}
                    {dayWorkshops.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayWorkshops.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Workshops */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Workshops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workshops
              .filter((w) => w.status === "upcoming")
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((workshop) => (
                <div
                  key={workshop.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">{workshop.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(workshop.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {workshop.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {workshop.enrolled}/{workshop.capacity}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{workshop.level}</Badge>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
