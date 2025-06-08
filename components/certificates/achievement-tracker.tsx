"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, Calendar, Rocket, Star, Lock } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  category: string
  points: number
  icon: string
  unlocked: boolean
  unlockedDate?: string
  progress: number
  maxProgress: number
}

interface AchievementTrackerProps {
  achievements: Achievement[]
}

export function AchievementTracker({ achievements }: AchievementTrackerProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "rocket":
        return <Rocket className="h-6 w-6" />
      case "users":
        return <Users className="h-6 w-6" />
      case "calendar":
        return <Calendar className="h-6 w-6" />
      case "trophy":
        return <Trophy className="h-6 w-6" />
      default:
        return <Star className="h-6 w-6" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Projects":
        return "bg-blue-500"
      case "Community":
        return "bg-green-500"
      case "Leadership":
        return "bg-purple-500"
      case "Learning":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const categories = [...new Set(achievements.map((a) => a.category))]
  const totalPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Unlocked</p>
                <p className="text-2xl font-bold">
                  {unlockedCount}/{achievements.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements by Category */}
      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{category}</h3>
            <Badge variant="outline" className={`${getCategoryColor(category)} text-white border-0`}>
              {achievements.filter((a) => a.category === category && a.unlocked).length}/
              {achievements.filter((a) => a.category === category).length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements
              .filter((achievement) => achievement.category === category)
              .map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`relative ${achievement.unlocked ? "border-green-500" : "opacity-75"}`}
                >
                  {!achievement.unlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${achievement.unlocked ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                      >
                        {getIcon(achievement.icon)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{achievement.points} pts</Badge>
                          {achievement.unlocked && achievement.unlockedDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(achievement.unlockedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <CardDescription>{achievement.description}</CardDescription>

                    {!achievement.unlocked && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                    )}

                    {achievement.unlocked && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Trophy className="h-4 w-4" />
                        Achievement Unlocked!
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
