import Image from "next/image"
import { Calendar, MapPin, ChevronRight } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EventCardProps {
  title: string
  date: string
  location: string
  description: string
  image: string
}

export function EventCard({ title, date, location, description, image }: EventCardProps) {
  return (
    <Card className="overflow-hidden bg-gray-900/60 border-white/10 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
            {date}
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <MapPin className="h-4 w-4 mr-2 text-purple-500" />
            {location}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-300">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          className="w-full justify-between text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
        >
          Register Now <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
