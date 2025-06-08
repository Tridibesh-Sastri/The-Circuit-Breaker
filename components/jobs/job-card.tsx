"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, DollarSign, Users, Bookmark, ExternalLink, Star } from "lucide-react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "internship" | "contract"
  experience: "entry" | "mid" | "senior"
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  skills: string[]
  benefits: string[]
  postedDate: string
  deadline?: string
  remote: boolean
  companyLogo: string
  applicationCount: number
  matchScore?: number
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-500"
      case "part-time":
        return "bg-blue-500"
      case "internship":
        return "bg-purple-500"
      case "contract":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case "entry":
        return "bg-green-100 text-green-800"
      case "mid":
        return "bg-yellow-100 text-yellow-800"
      case "senior":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    if (job.type === "internship") {
      return `$${salary.min}-${salary.max}/hour`
    }
    return `$${(salary.min / 1000).toFixed(0)}k-${(salary.max / 1000).toFixed(0)}k`
  }

  const daysAgo = Math.floor((Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24))

  const handleApply = () => {
    console.log("Applying to job:", job.id)
  }

  const handleSave = () => {
    console.log("Saving job:", job.id)
  }

  const handleViewDetails = () => {
    console.log("Viewing job details:", job.id)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={job.companyLogo || "/placeholder.svg"} alt={job.company} />
              <AvatarFallback>
                {job.company
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
              <CardDescription className="text-base font-medium">{job.company}</CardDescription>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                  {job.remote && (
                    <Badge variant="outline" className="ml-1 text-xs">
                      Remote
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatSalary(job.salary)}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {job.applicationCount} applicants
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {job.matchScore && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {job.matchScore}% match
              </Badge>
            )}
            <div className="flex gap-1">
              <Badge variant="outline" className={`${getTypeColor(job.type)} text-white border-0`}>
                {job.type}
              </Badge>
              <Badge variant="outline" className={getExperienceColor(job.experience)}>
                {job.experience}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Required Skills</h4>
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 6).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 6} more
              </Badge>
            )}
          </div>
        </div>

        {job.deadline && (
          <div className="text-sm text-muted-foreground">
            <Clock className="h-4 w-4 inline mr-1" />
            Application deadline: {new Date(job.deadline).toLocaleDateString()}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={handleApply} className="flex-1">
            Apply Now
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleViewDetails}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
