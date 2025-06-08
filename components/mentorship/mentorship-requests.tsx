"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, X, MessageCircle, Calendar } from "lucide-react"

interface MentorshipRequest {
  id: string
  type: "sent" | "received"
  mentorName: string
  menteeName: string
  profileImage: string
  expertise: string[]
  message: string
  status: "pending" | "accepted" | "declined"
  createdAt: string
  preferredSchedule?: string
}

export function MentorshipRequests() {
  const [requests, setRequests] = useState<MentorshipRequest[]>([
    {
      id: "1",
      type: "sent",
      mentorName: "Dr. Sarah Johnson",
      menteeName: "Current User",
      profileImage: "/placeholder.svg?height=50&width=50",
      expertise: ["Circuit Design", "FPGA"],
      message:
        "Hi Dr. Johnson, I would love to learn more about advanced circuit design techniques. I have completed basic electronics courses and am working on a senior project involving FPGA programming.",
      status: "pending",
      createdAt: "2024-01-18",
      preferredSchedule: "Weekends, 2-4 PM",
    },
    {
      id: "2",
      type: "received",
      mentorName: "Current User",
      menteeName: "Alex Chen",
      profileImage: "/placeholder.svg?height=50&width=50",
      expertise: ["Arduino", "IoT"],
      message:
        "Hello! I saw your profile and would appreciate guidance on my IoT project. I am building a smart home automation system and need help with sensor integration.",
      status: "pending",
      createdAt: "2024-01-17",
      preferredSchedule: "Weekday evenings",
    },
    {
      id: "3",
      type: "sent",
      mentorName: "Mark Chen",
      menteeName: "Current User",
      profileImage: "/placeholder.svg?height=50&width=50",
      expertise: ["Embedded Systems"],
      message:
        "I am interested in learning about embedded systems development for automotive applications. Could you help me understand the industry standards and best practices?",
      status: "accepted",
      createdAt: "2024-01-15",
    },
  ])

  const handleAcceptRequest = (requestId: string) => {
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "accepted" } : req)))
  }

  const handleDeclineRequest = (requestId: string) => {
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "declined" } : req)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-500"
      case "accepted":
        return "bg-green-500"
      case "declined":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "declined":
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const sentRequests = requests.filter((r) => r.type === "sent")
  const receivedRequests = requests.filter((r) => r.type === "received")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="received" className="space-y-4">
        <TabsList>
          <TabsTrigger value="received">
            Received ({receivedRequests.filter((r) => r.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="sent">Sent ({sentRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedRequests.length > 0 ? (
            <div className="space-y-4">
              {receivedRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={request.profileImage || "/placeholder.svg"} alt={request.menteeName} />
                          <AvatarFallback>
                            {request.menteeName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{request.menteeName}</CardTitle>
                          <CardDescription>
                            Mentorship request • {new Date(request.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className={`${getStatusColor(request.status)} text-white border-0`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Interested in:</h4>
                      <div className="flex flex-wrap gap-1">
                        {request.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Message:</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{request.message}</p>
                    </div>

                    {request.preferredSchedule && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Preferred Schedule:</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {request.preferredSchedule}
                        </div>
                      </div>
                    )}

                    {request.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={() => handleAcceptRequest(request.id)} className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineRequest(request.id)}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {request.status === "accepted" && (
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Session
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No mentorship requests</h3>
                <p className="text-muted-foreground">Requests from students will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length > 0 ? (
            <div className="space-y-4">
              {sentRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={request.profileImage || "/placeholder.svg"} alt={request.mentorName} />
                          <AvatarFallback>
                            {request.mentorName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{request.mentorName}</CardTitle>
                          <CardDescription>Sent {new Date(request.createdAt).toLocaleDateString()}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className={`${getStatusColor(request.status)} text-white border-0`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Your message:</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{request.message}</p>
                    </div>

                    {request.status === "accepted" && (
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Session
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sent requests</h3>
                <p className="text-muted-foreground">Your mentorship requests will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
