import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"

interface EventCardProps {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  maxParticipants?: number
  currentParticipants?: number
  imageUrl?: string
  isPast?: boolean
}

export function EventCard({
  id,
  title,
  description,
  startDate,
  endDate,
  location,
  maxParticipants,
  currentParticipants = 0,
  imageUrl = "/placeholder.svg?height=200&width=400",
  isPast = false,
}: EventCardProps) {
  const formattedStartDate = format(startDate, "MMM d, yyyy")
  const formattedStartTime = format(startDate, "h:mm a")
  const formattedEndTime = format(endDate, "h:mm a")

  const isSameDay = format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd")
  const dateTimeDisplay = isSameDay
    ? `${formattedStartDate}, ${formattedStartTime} - ${formattedEndTime}`
    : `${formattedStartDate} ${formattedStartTime} - ${format(endDate, "MMM d, yyyy h:mm a")}`

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
        {isPast && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Badge variant="destructive" className="text-lg font-semibold">
              Past Event
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 text-xl font-semibold">
          <Link href={`/dashboard/events/${id}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{dateTimeDisplay}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{location}</span>
          </div>
          {maxParticipants && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>
                {currentParticipants} / {maxParticipants} participants
              </span>
            </div>
          )}
        </div>
        <p className="line-clamp-3 text-sm">{description}</p>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-4 py-3">
        <Link href={`/dashboard/events/${id}`} className="w-full">
          <Button className="w-full" variant={isPast ? "outline" : "default"}>
            {isPast ? "View Details" : "Register Now"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
