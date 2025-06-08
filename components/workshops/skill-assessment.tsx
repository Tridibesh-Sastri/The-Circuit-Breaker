"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, BookOpen, Target, TrendingUp, Star } from "lucide-react"

interface Workshop {
  id: string
  title: string
  skills: string[]
  status: string
}

interface SkillAssessmentProps {
  workshops: Workshop[]
}

interface Assessment {
  id: string
  workshopId: string
  workshopTitle: string
  participant: string
  skills: {
    name: string
    preScore: number
    postScore: number
    improvement: number
  }[]
  overallScore: number
  completedAt: string
  certificateEarned: boolean
}

export function SkillAssessment({ workshops }: SkillAssessmentProps) {
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>("")
  const [assessments, setAssessments] = useState<Assessment[]>([])

  // Mock assessment data
  const mockAssessments: Assessment[] = [
    {
      id: "1",
      workshopId: "1",
      workshopTitle: "Arduino Basics Workshop",
      participant: "John Doe",
      skills: [
        { name: "Arduino Programming", preScore: 30, postScore: 85, improvement: 55 },
        { name: "Circuit Design", preScore: 25, postScore: 75, improvement: 50 },
        { name: "Embedded Systems", preScore: 20, postScore: 70, improvement: 50 },
      ],
      overallScore: 77,
      completedAt: "2024-01-15T16:00:00Z",
      certificateEarned: true,
    },
    {
      id: "2",
      workshopId: "1",
      workshopTitle: "Arduino Basics Workshop",
      participant: "Jane Smith",
      skills: [
        { name: "Arduino Programming", preScore: 40, postScore: 90, improvement: 50 },
        { name: "Circuit Design", preScore: 35, postScore: 80, improvement: 45 },
        { name: "Embedded Systems", preScore: 30, postScore: 75, improvement: 45 },
      ],
      overallScore: 82,
      completedAt: "2024-01-15T16:00:00Z",
      certificateEarned: true,
    },
  ]

  const handleWorkshopSelect = (workshopId: string) => {
    setSelectedWorkshop(workshopId)
    setAssessments(mockAssessments.filter((a) => a.workshopId === workshopId))
  }

  const averageImprovement =
    assessments.length > 0
      ? assessments.reduce(
          (sum, assessment) =>
            sum +
            assessment.skills.reduce((skillSum, skill) => skillSum + skill.improvement, 0) / assessment.skills.length,
          0,
        ) / assessments.length
      : 0

  const certificateRate =
    assessments.length > 0 ? (assessments.filter((a) => a.certificateEarned).length / assessments.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Workshop Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skill Assessment
          </CardTitle>
          <CardDescription>Track skill development and learning outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Workshop</label>
              <select
                value={selectedWorkshop}
                onChange={(e) => handleWorkshopSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a workshop...</option>
                {workshops
                  .filter((w) => w.status === "completed")
                  .map((workshop) => (
                    <option key={workshop.id} value={workshop.id}>
                      {workshop.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedWorkshop && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="individual">Individual Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Participants</p>
                      <p className="text-2xl font-bold">{assessments.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Improvement</p>
                      <p className="text-2xl font-bold text-green-600">+{averageImprovement.toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Certificate Rate</p>
                      <p className="text-2xl font-bold text-purple-600">{certificateRate.toFixed(1)}%</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Score</p>
                      <p className="text-2xl font-bold">
                        {assessments.length > 0
                          ? (assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skill Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Development Overview</CardTitle>
                <CardDescription>Average improvement across all participants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.length > 0 &&
                    assessments[0].skills.map((skill, index) => {
                      const avgPreScore =
                        assessments.reduce((sum, a) => sum + a.skills[index].preScore, 0) / assessments.length
                      const avgPostScore =
                        assessments.reduce((sum, a) => sum + a.skills[index].postScore, 0) / assessments.length
                      const avgImprovement = avgPostScore - avgPreScore

                      return (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-green-600">+{avgImprovement.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Pre: {avgPreScore.toFixed(1)}%</span>
                                <span>Post: {avgPostScore.toFixed(1)}%</span>
                              </div>
                              <Progress value={avgPostScore} className="h-2" />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="individual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Individual Assessment Results</CardTitle>
                <CardDescription>Detailed results for each participant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{assessment.participant}</h3>
                          <p className="text-sm text-gray-600">
                            Completed on {new Date(assessment.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">Overall: {assessment.overallScore}%</Badge>
                          {assessment.certificateEarned && (
                            <Badge className="bg-green-100 text-green-800">
                              <Award className="h-3 w-3 mr-1" />
                              Certificate Earned
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {assessment.skills.map((skill) => (
                          <div key={skill.name} className="space-y-2">
                            <h4 className="font-medium text-sm">{skill.name}</h4>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Pre: {skill.preScore}%</span>
                                <span>Post: {skill.postScore}%</span>
                              </div>
                              <Progress value={skill.postScore} className="h-2" />
                              <div className="text-xs text-green-600 text-center">
                                +{skill.improvement}% improvement
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Effectiveness</CardTitle>
                  <CardDescription>How well the workshop achieved its learning objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Knowledge Retention</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span>Skill Application</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span>Practical Understanding</span>
                      <span className="font-semibold">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Improvement Distribution</CardTitle>
                  <CardDescription>How participants improved across skill levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Beginner Level</span>
                      <span className="font-semibold text-green-600">+65%</span>
                    </div>
                    <Progress value={65} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span>Intermediate Level</span>
                      <span className="font-semibold text-green-600">+45%</span>
                    </div>
                    <Progress value={45} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span>Advanced Level</span>
                      <span className="font-semibold text-green-600">+25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
