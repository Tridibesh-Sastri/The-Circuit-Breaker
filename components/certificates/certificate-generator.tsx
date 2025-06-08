"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye } from "lucide-react"

export function CertificateGenerator() {
  const [formData, setFormData] = useState({
    recipientName: "",
    certificateTitle: "",
    description: "",
    type: "",
    issueDate: new Date().toISOString().split("T")[0],
    template: "modern",
  })
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      // Mock certificate generation - replace with actual PDF generation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Generated certificate:", formData)
      // Here you would typically call a PDF generation service
    } catch (error) {
      console.error("Error generating certificate:", error)
    } finally {
      setGenerating(false)
    }
  }

  const handlePreview = () => {
    console.log("Previewing certificate with data:", formData)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Certificate Generator
          </CardTitle>
          <CardDescription>
            Generate custom certificates for achievements, completions, and participation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Name</label>
              <Input
                placeholder="Enter recipient's full name"
                value={formData.recipientName}
                onChange={(e) => setFormData((prev) => ({ ...prev, recipientName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Certificate Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certificate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completion">Completion Certificate</SelectItem>
                  <SelectItem value="achievement">Achievement Certificate</SelectItem>
                  <SelectItem value="participation">Participation Certificate</SelectItem>
                  <SelectItem value="excellence">Excellence Award</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Certificate Title</label>
            <Input
              placeholder="e.g., Arduino Programming Fundamentals"
              value={formData.certificateTitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, certificateTitle: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Brief description of the achievement or completion"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Issue Date</label>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, issueDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Template</label>
              <Select
                value={formData.template}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, template: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handlePreview} variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generating || !formData.recipientName || !formData.certificateTitle}
              className="flex-1"
            >
              {generating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Generate PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Template Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
          <CardDescription>Preview of the selected certificate template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/10">
            <div className="space-y-4">
              <div className="text-2xl font-bold text-primary">Circuit Breaker Electronics Club</div>
              <div className="text-lg">Certificate of {formData.type || "Achievement"}</div>
              <div className="text-sm text-muted-foreground">This is to certify that</div>
              <div className="text-xl font-semibold">{formData.recipientName || "[Recipient Name]"}</div>
              <div className="text-sm text-muted-foreground">has successfully completed</div>
              <div className="text-lg font-medium">{formData.certificateTitle || "[Certificate Title]"}</div>
              {formData.description && (
                <div className="text-sm text-muted-foreground max-w-md mx-auto">{formData.description}</div>
              )}
              <div className="text-sm text-muted-foreground">
                Issued on {new Date(formData.issueDate).toLocaleDateString()}
              </div>
              <div className="flex justify-center gap-4 pt-4">
                <Badge variant="outline">Template: {formData.template}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
