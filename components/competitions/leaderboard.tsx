"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award, Star } from "lucide-react"

interface Competition {
  id: string
  title: string
  status: string
}

interface LeaderboardProps {
  competitions: Competition[]
}

interface LeaderboardEntry {
  rank: number
  team: string
  members: string[]
  score: number
  submissions: number
  lastSubmission: string
}

export function Leaderboard({ competitions }: LeaderboardProps) {
  // Mock leaderboard data
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      team: "Circuit Masters",
      members: ["John Doe", "Jane Smith", "Mike Johnson"],
      score: 95,
      submissions: 3,
      lastSubmission: "2024-01-15T14:30:00Z",
    },
    {
      rank: 2,
      team: "Code Breakers",
      members: ["Alice Brown", "Bob Wilson"],
      score: 88,
      submissions: 2,
      lastSubmission: "2024-01-15T12:15:00Z",
    },
    {
      rank: 3,
      team: "Innovation Squad",
      members: ["Charlie Davis", "Diana Lee", "Eve Taylor", "Frank Miller"],
      score: 82,
      submissions: 4,
      lastSubmission: "2024-01-15T16:45:00Z",
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <Star className="h-6 w-6 text-gray-300" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 border-yellow-200"
      case 2:
        return "bg-gray-50 border-gray-200"
      case 3:
        return "bg-amber-50 border-amber-200"
      default:
        return "bg-white border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Competition Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Competition Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select a competition...</option>
            {competitions
              .filter((c) => c.status === "ongoing" || c.status === "completed")
              .map((competition) => (
                <option key={competition.id} value={competition.id}>
                  {competition.title}
                </option>
              ))}
          </select>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Current Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockLeaderboard.map((entry) => (
              <div key={entry.rank} className={`p-4 rounded-lg border-2 ${getRankColor(entry.rank)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank)}
                      <span className="text-2xl font-bold">#{entry.rank}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{entry.team}</h3>
                      <p className="text-sm text-gray-600">{entry.members.join(", ")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{entry.score}</div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <span>{entry.submissions} submissions</span>
                  <span>Last: {new Date(entry.lastSubmission).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">Circuit Masters</div>
              <div className="text-sm text-gray-600">Leading Team</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">95</div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-600">Active Teams</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
