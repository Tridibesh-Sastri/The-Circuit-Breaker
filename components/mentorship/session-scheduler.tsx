"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MessageCircle, Star, CheckCircle, X } from "lucide-react"

interface MentorshipSession {
  id: string
  mentorId: string
  mentorName: string
  date: string
  time: string
  duration: number
  topic: string
  status: "scheduled" | "completed" | "cancelled"
  feedback?: {
    rating: number
    comment: string
  }
}

interface SessionSchedulerProps {
  sessions: MentorshipSession[]
}

export function SessionScheduler({ sessions }: SessionSchedulerProps) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const upcomingSessions = sessions.filter((s) => s.status === "scheduled")
  const pastSessions = sessions.filter((s) => s.status === "completed" || s.status === "cancelled")

  return (
    <div className="space-y-6">
      {/* Upcoming Sessions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Upcoming Sessions</h3>
        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{session.topic}</CardTitle>
                    <Badge variant="secondary" className={`${getStatusColor(session.status)} text-white border-0`}>
                      {getStatusIcon(session.status)}
                      <span className="ml-1">{session.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>with {session.mentorName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {session.time} ({session.duration} min)
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
              <p className="text-muted-foreground">Schedule a session with a mentor to get started</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Sessions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Session History</h3>
        {pastSessions.length > 0 ? (
          <div className="space-y-3">
            {pastSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{session.topic}</h4>
                        <Badge variant="secondary" className={`${getStatusColor(session.status)} text-white border-0`}>
                          {getStatusIcon(session.status)}
                          <span className="ml-1">{session.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.mentorName} • {new Date(session.date).toLocaleDateString()} • {session.duration} min
                      </p>
                      {session.feedback && (
                        <div className="mt-2 p-2 bg-muted rounded-md">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < session.feedback!.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium">{session.feedback.rating}/5</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{session.feedback.comment}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      {session.status === "completed" && !session.feedback && (
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4 mr-2" />
                          Rate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No session history</h3>
              <p className="text-muted-foreground">Your completed sessions will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
