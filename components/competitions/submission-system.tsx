"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Github, ExternalLink, Clock } from "lucide-react"

interface Competition {
  id: string
  title: string
  status: string
  endDate: string
}

interface SubmissionSystemProps {
  competitions: Competition[]
}

interface Submission {
  id: string
  competitionId: string
  team: string
  title: string
  description: string
  submittedAt: string
  files: Array<{ name: string; type: string; size: string }>
  githubRepo?: string
  demoUrl?: string
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected"
}

export function SubmissionSystem({ competitions }: SubmissionSystemProps) {
  const [selectedCompetition, setSelectedCompetition] = useState("")

  // Mock submission data
  const mockSubmissions: Submission[] = [
    {
      id: "1",
      competitionId: "1",
      team: "Circuit Masters",
      title: "Smart City Traffic Management System",
      description: "IoT-based traffic management solution using real-time data analysis.",
      submittedAt: "2024-01-15T14:30:00Z",
      files: [
        { name: "project-documentation.pdf", type: "PDF", size: "2.5 MB" },
        { name: "circuit-diagram.png", type: "Image", size: "1.2 MB" },
        { name: "demo-video.mp4", type: "Video", size: "45 MB" },
      ],
      githubRepo: "https://github.com/team/smart-traffic",
      demoUrl: "https://demo.smart-traffic.com",
      status: "submitted",
    },
    {
      id: "2",
      competitionId: "2",
      team: "Code Breakers",
      title: "Real-time Sensor Network",
      description: "Embedded system for environmental monitoring with wireless communication.",
      submittedAt: "2024-01-14T16:45:00Z",
      files: [
        { name: "technical-report.pdf", type: "PDF", size: "3.1 MB" },
        { name: "source-code.zip", type: "Archive", size: "5.8 MB" },
      ],
      githubRepo: "https://github.com/team/sensor-network",
      status: "under-review",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under-review":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredSubmissions = mockSubmissions.filter(
    (submission) => !selectedCompetition || submission.competitionId === selectedCompetition,
  )

  return (
    <div className="space-y-6">
      {/* Competition Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Submission System
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
                {competitions.map((competition) => (
                  <option key={competition.id} value={competition.id}>
                    {competition.title}
                  </option>
                ))}
              </select>
            </div>
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              New Submission
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => {
          const competition = competitions.find((c) => c.id === submission.competitionId)
          const timeLeft = competition ? new Date(competition.endDate).getTime() - new Date().getTime() : 0
          const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

          return (
            <Card key={submission.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{submission.title}</CardTitle>
                    <p className="text-sm text-gray-600">by {submission.team}</p>
                    {competition && <p className="text-xs text-gray-500">for {competition.title}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(submission.status)}>{submission.status.replace("-", " ")}</Badge>
                    {daysLeft > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {daysLeft}d left
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">{submission.description}</p>

                {/* Submission Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Submitted Files</h4>
                    <div className="space-y-1">
                      {submission.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            <span>{file.name}</span>
                          </div>
                          <span className="text-gray-500">{file.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Links</h4>
                    {submission.githubRepo && (
                      <a
                        href={submission.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <Github className="h-4 w-4" />
                        Source Code
                      </a>
                    )}
                    {submission.demoUrl && (
                      <a
                        href={submission.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>

                {/* Submission Info */}
                <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t">
                  <span>Submitted on {new Date(submission.submittedAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {submission.status === "draft" && <Button size="sm">Edit Submission</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-600">Start by creating your first submission for a competition.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
