"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Clock, Star, Users } from "lucide-react"

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

interface MentorshipMatchingProps {
  mentors: Mentor[]
}

export function MentorshipMatching({ mentors }: MentorshipMatchingProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = useState<string>("")
  const [availability, setAvailability] = useState<string>("")
  const [careerGoals, setCareerGoals] = useState<string[]>([])
  const [matches, setMatches] = useState<Array<Mentor & { matchScore: number }>>([])
  const [showMatches, setShowMatches] = useState(false)

  const skillOptions = [
    "Circuit Design",
    "Embedded Systems",
    "FPGA",
    "Arduino",
    "PCB Design",
    "Signal Processing",
    "IoT",
    "Hardware Testing",
    "Product Development",
    "Microcontrollers",
    "Power Electronics",
    "RF Design",
  ]

  const careerGoalOptions = [
    "Industry Transition",
    "Skill Development",
    "Project Guidance",
    "Career Advancement",
    "Research Collaboration",
    "Startup Advice",
  ]

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleCareerGoalToggle = (goal: string) => {
    setCareerGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))
  }

  const calculateMatchScore = (mentor: Mentor) => {
    let score = 0

    // Skill matching (40% weight)
    const skillMatches = selectedSkills.filter((skill) => mentor.expertise.includes(skill)).length
    score += (skillMatches / Math.max(selectedSkills.length, 1)) * 40

    // Experience level matching (20% weight)
    if (experienceLevel === "beginner" && mentor.yearsExperience >= 5) score += 20
    if (experienceLevel === "intermediate" && mentor.yearsExperience >= 8) score += 20
    if (experienceLevel === "advanced" && mentor.yearsExperience >= 12) score += 20

    // Availability matching (20% weight)
    if (availability && mentor.availability.toLowerCase().includes(availability.toLowerCase())) {
      score += 20
    }

    // Rating bonus (20% weight)
    score += (mentor.rating / 5) * 20

    return Math.round(score)
  }

  const findMatches = () => {
    const mentorMatches = mentors
      .map((mentor) => ({
        ...mentor,
        matchScore: calculateMatchScore(mentor),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)

    setMatches(mentorMatches)
    setShowMatches(true)
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Smart Mentor Matching
          </CardTitle>
          <CardDescription>Tell us about your goals and preferences to find the perfect mentor match</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skills Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">What skills do you want to develop?</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {skillOptions.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  />
                  <label htmlFor={skill} className="text-sm cursor-pointer">
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-3">
            <h4 className="font-medium">What's your experience level?</h4>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <h4 className="font-medium">When are you available?</h4>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger>
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekdays">Weekdays</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="evenings">Evenings</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Career Goals */}
          <div className="space-y-3">
            <h4 className="font-medium">What are your career goals?</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {careerGoalOptions.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={careerGoals.includes(goal)}
                    onCheckedChange={() => handleCareerGoalToggle(goal)}
                  />
                  <label htmlFor={goal} className="text-sm cursor-pointer">
                    {goal}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={findMatches} className="w-full" disabled={selectedSkills.length === 0 || !experienceLevel}>
            <Sparkles className="h-4 w-4 mr-2" />
            Find My Perfect Matches
          </Button>
        </CardContent>
      </Card>

      {/* Matching Results */}
      {showMatches && (
        <Card>
          <CardHeader>
            <CardTitle>Your Mentor Matches</CardTitle>
            <CardDescription>Mentors ranked by compatibility with your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matches.slice(0, 5).map((mentor) => (
                <Card
                  key={mentor.id}
                  className="border-l-4"
                  style={{
                    borderLeftColor:
                      getMatchColor(mentor.matchScore) === "bg-green-500"
                        ? "#22c55e"
                        : getMatchColor(mentor.matchScore) === "bg-yellow-500"
                          ? "#eab308"
                          : "#ef4444",
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentor.profileImage || "/placeholder.svg"} alt={mentor.name} />
                          <AvatarFallback>
                            {mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{mentor.name}</h4>
                          <p className="text-sm text-muted-foreground">{mentor.title}</p>
                          <p className="text-xs text-muted-foreground">{mentor.company}</p>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {mentor.expertise
                              .filter((skill) => selectedSkills.includes(skill))
                              .map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                          </div>

                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {mentor.rating}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {mentor.menteeCount} mentees
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {mentor.availability}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={`${getMatchColor(mentor.matchScore)} text-white border-0 mb-2`}
                        >
                          {mentor.matchScore}% Match
                        </Badge>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full">
                            Request Mentorship
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
