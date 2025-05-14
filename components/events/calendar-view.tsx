"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  title: string
  startDate: Date
  endDate: Date
}

interface CalendarViewProps {
  events: Event[]
  onSelectDate: (date: Date) => void
}

export function CalendarView({ events, onSelectDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateClick = (day: Date) => {
    setSelectedDate(day)
    onSelectDate(day)
  }

  const hasEventOnDay = (day: Date) => {
    return events.some((event) => isSameDay(day, new Date(event.startDate)) || isSameDay(day, new Date(event.endDate)))
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2 text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {monthDays.map((day, i) => {
          const hasEvent = hasEventOnDay(day)
          return (
            <Button
              key={i}
              variant="ghost"
              className={cn(
                "h-10 w-full rounded-md p-0 text-sm font-normal",
                !isSameMonth(day, monthStart) && "text-muted-foreground opacity-50",
                isSameDay(day, selectedDate) && "bg-primary text-primary-foreground",
                hasEvent && !isSameDay(day, selectedDate) && "border-primary text-primary",
              )}
              onClick={() => handleDateClick(day)}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
              {hasEvent && <div className="mt-1 h-1 w-1 rounded-full bg-current" />}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
