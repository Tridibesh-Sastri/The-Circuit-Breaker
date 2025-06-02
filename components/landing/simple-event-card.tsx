import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

interface SimpleEventCardProps {
  event: {
    id: number
    title: string
    date: string
    time: string
    location: string
    type: "workshop" | "bootcamp" | "seminar"
    description: string
    attendees: number
    maxAttendees: number
  }
}

export function SimpleEventCard({ event }: SimpleEventCardProps) {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "workshop":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "bootcamp":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "seminar":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="bg-gray-900/50 border-white/10 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getEventTypeColor(event.type)}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users className="h-3 w-3" />
            <span>
              {event.attendees}/{event.maxAttendees}
            </span>
          </div>
        </div>

        <CardTitle className="text-white text-lg line-clamp-1">{event.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-gray-300 text-sm line-clamp-2">{event.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{event.maxAttendees - event.attendees} spots remaining</p>
        </div>
      </CardContent>
    </Card>
  )
}
