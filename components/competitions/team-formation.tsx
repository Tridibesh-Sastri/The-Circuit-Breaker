"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, UserPlus } from "lucide-react"

interface Competition {
  id: string
  title: string
  maxTeamSize: number
  minTeamSize: number
  status: string
}

interface TeamFormationProps {
  competitions: Competition[]
}

interface Team {
  id: string
  name: string
  competitionId: string
  leader: string
  members: string[]
  skills: string[]
  lookingFor: string[]
  description: string
  isOpen: boolean
}

export function TeamFormation({ competitions }: TeamFormationProps) {
  const [selectedCompetition, setSelectedCompetition] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock team data
  const mockTeams: Team[] = [
    {
      id: "1",
      name: "Circuit Innovators",
      competitionId: "1",
      leader: "John Doe",
      members: ["John Doe", "Jane Smith"],
      skills: ["Arduino", "IoT", "Circuit Design"],
      lookingFor: ["Mobile Development", "UI/UX Design"],
      description: "Looking for creative minds to build innovative IoT solutions for smart cities.",
      isOpen: true,
    },
    {
      id: "2",
      name: "Embedded Masters",
      competitionId: "2",
      leader: "Alice Brown",
      members: ["Alice Brown"],
      skills: ["Embedded Systems", "C/C++", "Real-time Systems"],
      lookingFor: ["Hardware Design", "Signal Processing"],
      description: "Experienced in embedded systems, seeking hardware specialists for hackathon.",
      isOpen: true,
    },
  ]

  const filteredTeams = mockTeams.filter((team) => {
    const matchesCompetition = !selectedCompetition || team.competitionId === selectedCompetition
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCompetition && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Formation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <select
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All competitions</option>
                {competitions
                  .filter((c) => c.status === "registration-open" || c.status === "upcoming")
                  .map((competition) => (
                    <option key={competition.id} value={competition.id}>
                      {competition.title}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search teams or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Team
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeams.map((team) => {
          const competition = competitions.find((c) => c.id === team.competitionId)
          const spotsLeft = competition ? competition.maxTeamSize - team.members.length : 0

          return (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <p className="text-sm text-gray-600">Led by {team.leader}</p>
                  </div>
                  {team.isOpen && <Badge className="bg-green-100 text-green-800">Open</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">{team.description}</p>

                {/* Team Members */}
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Team Members ({team.members.length}/{competition?.maxTeamSize})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {team.members.map((member) => (
                      <Badge key={member} variant="outline" className="text-xs">
                        {member}
                      </Badge>
                    ))}
                    {spotsLeft > 0 && (
                      <Badge variant="outline" className="text-xs text-gray-500">
                        +{spotsLeft} spots available
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Team Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.skills.map((skill) => (
                      <Badge key={skill} className="bg-blue-100 text-blue-800 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Looking For */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Looking For</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.lookingFor.map((skill) => (
                      <Badge key={skill} className="bg-orange-100 text-orange-800 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {team.isOpen && spotsLeft > 0 && (
                  <Button className="w-full flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Request to Join
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTeams.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams found</h3>
            <p className="text-gray-600">Be the first to create a team for this competition!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
