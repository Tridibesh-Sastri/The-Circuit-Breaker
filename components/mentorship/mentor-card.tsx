"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, Calendar, MessageCircle, Clock } from "lucide-react"

interface Mentor {
  id: string
  name: string
  title: string
  company: string
  expertise: string[]
  rating: number
  totalSessions: number
  availability: string
  bio: string
  profileImage: string
  yearsExperience: number
  menteeCount: number
}

interface MentorCardProps {
  mentor: Mentor
}

export function MentorCard({ mentor }: MentorCardProps) {
  const handleRequestMentorship = () => {
    console.log("Requesting mentorship from:", mentor.id)
  }

  const handleViewProfile = () => {
    console.log("Viewing profile:", mentor.id)
  }

  const handleSendMessage = () => {
    console.log("Sending message to:", mentor.id)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.profileImage || "/placeholder.svg"} alt={mentor.name} />
            <AvatarFallback>
              {mentor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{mentor.name}</CardTitle>
            <CardDescription className="text-sm">{mentor.title}</CardDescription>
            <p className="text-xs text-muted-foreground">{mentor.company}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{mentor.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{mentor.bio}</p>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Expertise</h4>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{mentor.menteeCount} mentees</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{mentor.totalSessions} sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{mentor.availability}</span>
          </div>
          <div className="text-muted-foreground">{mentor.yearsExperience}+ years exp</div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={handleRequestMentorship} className="flex-1">
            Request Mentorship
          </Button>
          <Button size="sm" variant="outline" onClick={handleSendMessage}>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        <Button size="sm" variant="ghost" onClick={handleViewProfile} className="w-full">
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  )
}
