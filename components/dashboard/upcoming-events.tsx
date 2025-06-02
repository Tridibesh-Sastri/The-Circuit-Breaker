import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  type?: "workshop" | "competition" | "meetup" | "other"
}

interface UpcomingEventsProps {
  events: Event[]
  className?: string
}

export function UpcomingEvents({ events, className }: UpcomingEventsProps) {
  const getEventTypeColor = (type?: Event["type"]) => {
    if (!type) return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20"

    switch (type) {
      case "workshop":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "competition":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
      case "meetup":
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
      default:
        return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20"
    }
  }

  const formatEventType = (type?: string) => {
    if (!type) return "Event"
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming events</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{event.title}</h3>
                <Badge className={cn("font-normal", getEventTypeColor(event.type))}>
                  {formatEventType(event.type)}
                </Badge>
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard/events">View All Events</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
