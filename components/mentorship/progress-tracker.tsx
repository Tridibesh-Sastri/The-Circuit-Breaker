"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Clock, Star, Award, BookOpen } from "lucide-react"

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

interface ProgressTrackerProps {
  sessions: MentorshipSession[]
}

export function ProgressTracker({ sessions }: ProgressTrackerProps) {
  const completedSessions = sessions.filter((s) => s.status === "completed")
  const totalHours = completedSessions.reduce((sum, s) => sum + s.duration, 0) / 60
  const averageRating =
    completedSessions.filter((s) => s.feedback?.rating).reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) /
      completedSessions.filter((s) => s.feedback?.rating).length || 0

  const goals = [
    {
      id: "1",
      title: "Complete 10 Mentorship Sessions",
      description: "Attend regular mentorship sessions to build expertise",
      progress: Math.min((completedSessions.length / 10) * 100, 100),
      current: completedSessions.length,
      target: 10,
      icon: <Target className="h-5 w-5" />,
    },
    {
      id: "2",
      title: "Accumulate 20 Hours of Mentoring",
      description: "Gain substantial learning time with industry experts",
      progress: Math.min((totalHours / 20) * 100, 100),
      current: Math.round(totalHours * 10) / 10,
      target: 20,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "3",
      title: "Maintain 4.5+ Average Rating",
      description: "Consistently receive positive feedback from mentors",
      progress: Math.min((averageRating / 5) * 100, 100),
      current: Math.round(averageRating * 10) / 10,
      target: 4.5,
      icon: <Star className="h-5 w-5" />,
    },
  ]

  const achievements = [
    {
      id: "1",
      title: "First Session",
      description: "Completed your first mentorship session",
      unlocked: completedSessions.length >= 1,
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: "2",
      title: "Dedicated Learner",
      description: "Completed 5 mentorship sessions",
      unlocked: completedSessions.length >= 5,
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: "3",
      title: "Highly Rated",
      description: "Maintained 4.5+ average rating",
      unlocked: averageRating >= 4.5,
      icon: <Star className="h-5 w-5" />,
    },
  ]

  const recentTopics = [...new Set(completedSessions.slice(-5).map((s) => s.topic))]

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{completedSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{Math.round(totalHours * 10) / 10}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{Math.round(averageRating * 10) / 10}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="text-2xl font-bold">+{Math.round((completedSessions.length / 10) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Goals</CardTitle>
          <CardDescription>Track your progress towards mentorship milestones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {goal.icon}
                  <h4 className="font-medium">{goal.title}</h4>
                </div>
                <Badge variant={goal.progress >= 100 ? "default" : "secondary"}>
                  {goal.current}/{goal.target}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{goal.description}</p>
              <Progress value={goal.progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">{Math.round(goal.progress)}% complete</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Milestones you've unlocked in your mentorship journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${
                  achievement.unlocked ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-full ${
                      achievement.unlocked ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <h4 className="font-medium">{achievement.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                {achievement.unlocked && (
                  <Badge variant="default" className="mt-2">
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Learning Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Learning Topics</CardTitle>
          <CardDescription>Areas you've been focusing on recently</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recentTopics.map((topic, index) => (
                <Badge key={index} variant="outline">
                  {topic}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent sessions to display</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
