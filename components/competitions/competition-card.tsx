"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Trophy, Target } from "lucide-react"

interface Competition {
  id: string
  title: string
  description: string
  type: string
  startDate: string
  endDate: string
  registrationDeadline: string
  maxTeamSize: number
  minTeamSize: number
  status: string
  difficulty: string
  prizes: Array<{ position: number; title: string; value: string }>
  participants: number
  maxParticipants: number
  tags: string[]
}

interface CompetitionCardProps {
  competition: Competition
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "registration-open":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-orange-100 text-orange-800"
      case "judging":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const participationRate = (competition.participants / competition.maxParticipants) * 100

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getStatusColor(competition.status)}>{competition.status.replace("-", " ")}</Badge>
          <Badge className={getDifficultyColor(competition.difficulty)}>{competition.difficulty}</Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{competition.title}</CardTitle>
        <CardDescription className="line-clamp-2">{competition.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Competition Type */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Target className="h-4 w-4" />
          <span>{competition.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
        </div>

        {/* Dates */}
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(competition.startDate).toLocaleDateString()} -{" "}
              {new Date(competition.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Registration until {new Date(competition.registrationDeadline).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Team Size */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>
            Team size:{" "}
            {competition.minTeamSize === competition.maxTeamSize
              ? competition.maxTeamSize
              : `${competition.minTeamSize}-${competition.maxTeamSize}`}{" "}
            members
          </span>
        </div>

        {/* Participation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Participants</span>
            <span className="font-medium">
              {competition.participants}/{competition.maxParticipants}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${participationRate}%` }}
            ></div>
          </div>
        </div>

        {/* Prizes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Trophy className="h-4 w-4" />
            <span>Prizes:</span>
          </div>
          <div className="space-y-1">
            {competition.prizes.slice(0, 3).map((prize) => (
              <div key={prize.position} className="flex justify-between text-xs">
                <span>{prize.title}</span>
                <span className="font-medium text-green-600">{prize.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {competition.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {competition.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{competition.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {competition.status === "registration-open" && (
            <Button className="w-full" disabled={competition.participants >= competition.maxParticipants}>
              {competition.participants >= competition.maxParticipants ? "Competition Full" : "Register Now"}
            </Button>
          )}
          {competition.status === "upcoming" && (
            <Button className="w-full" variant="outline">
              View Details
            </Button>
          )}
          {competition.status === "ongoing" && <Button className="w-full">Submit Entry</Button>}
          {competition.status === "judging" && (
            <Button className="w-full" variant="outline">
              View Submissions
            </Button>
          )}
          {competition.status === "completed" && (
            <Button className="w-full" variant="outline">
              View Results
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
