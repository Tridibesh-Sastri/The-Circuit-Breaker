"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Download, Eye, Calendar, CheckCircle, Clock } from "lucide-react"

interface Certificate {
  id: string
  title: string
  description: string
  type: "completion" | "achievement" | "participation" | "excellence"
  status: "earned" | "in_progress" | "available"
  earnedDate?: string
  verificationCode?: string
  progress?: number
  requirements: string[]
  badgeUrl?: string
}

interface CertificateCardProps {
  certificate: Certificate
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "earned":
        return "bg-green-500"
      case "in_progress":
        return "bg-orange-500"
      case "available":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "completion":
        return "bg-blue-500"
      case "achievement":
        return "bg-purple-500"
      case "participation":
        return "bg-green-500"
      case "excellence":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleDownload = () => {
    // Generate and download PDF certificate
    console.log("Downloading certificate:", certificate.id)
  }

  const handlePreview = () => {
    // Open certificate preview modal
    console.log("Previewing certificate:", certificate.id)
  }

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(certificate.status)}`} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <Badge variant="outline" className={`${getTypeColor(certificate.type)} text-white border-0`}>
              {certificate.type}
            </Badge>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            {certificate.status === "earned" && <CheckCircle className="h-3 w-3" />}
            {certificate.status === "in_progress" && <Clock className="h-3 w-3" />}
            {certificate.status.replace("_", " ")}
          </Badge>
        </div>
        <CardTitle className="text-lg">{certificate.title}</CardTitle>
        <CardDescription>{certificate.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {certificate.status === "in_progress" && certificate.progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{certificate.progress}%</span>
            </div>
            <Progress value={certificate.progress} className="h-2" />
          </div>
        )}

        {certificate.earnedDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Earned on {new Date(certificate.earnedDate).toLocaleDateString()}
          </div>
        )}

        {certificate.verificationCode && (
          <div className="text-xs text-muted-foreground">Verification: {certificate.verificationCode}</div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Requirements:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {certificate.requirements.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          {certificate.status === "earned" && (
            <>
              <Button size="sm" onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button size="sm" variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4" />
              </Button>
            </>
          )}
          {certificate.status === "in_progress" && (
            <Button size="sm" variant="outline" className="flex-1">
              View Progress
            </Button>
          )}
          {certificate.status === "available" && (
            <Button size="sm" variant="outline" className="flex-1">
              Start Working
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
