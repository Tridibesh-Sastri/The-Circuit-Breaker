"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, CheckCircle, XCircle, Shield, Calendar, User } from "lucide-react"

interface VerificationResult {
  valid: boolean
  certificate?: {
    id: string
    title: string
    recipient: string
    issueDate: string
    verificationCode: string
    type: string
  }
  error?: string
}

export function VerificationSystem() {
  const [verificationCode, setVerificationCode] = useState("")
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleVerification = async () => {
    if (!verificationCode.trim()) return

    setLoading(true)
    try {
      // Mock verification - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (verificationCode === "CERT-ARD-2024-001") {
        setResult({
          valid: true,
          certificate: {
            id: "1",
            title: "Arduino Programming Fundamentals",
            recipient: "John Doe",
            issueDate: "2024-01-15",
            verificationCode: "CERT-ARD-2024-001",
            type: "Completion Certificate",
          },
        })
      } else {
        setResult({
          valid: false,
          error: "Certificate not found or verification code is invalid",
        })
      }
    } catch (error) {
      setResult({
        valid: false,
        error: "Verification service temporarily unavailable",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Certificate Verification
          </CardTitle>
          <CardDescription>
            Verify the authenticity of digital certificates issued by Circuit Breaker Electronics Club
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter verification code (e.g., CERT-ARD-2024-001)"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleVerification} disabled={loading || !verificationCode.trim()}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              Verify
            </Button>
          </div>

          {result && (
            <Card className={`border-2 ${result.valid ? "border-green-500" : "border-red-500"}`}>
              <CardContent className="p-4">
                {result.valid && result.certificate ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Certificate Verified</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Certificate Title</label>
                          <p className="font-semibold">{result.certificate.title}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Type</label>
                          <p>{result.certificate.type}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Recipient</label>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <p>{result.certificate.recipient}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <p>{new Date(result.certificate.issueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Verification Code</span>
                        <Badge variant="outline">{result.certificate.verificationCode}</Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <span>{result.error}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Verification Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">For Employers</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Verification codes are unique for each certificate</li>
                <li>• All certificates include issue date and recipient name</li>
                <li>• Contact us if you need additional verification</li>
                <li>• Certificates remain verifiable indefinitely</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Certificate Holders</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep your verification code secure</li>
                <li>• Share only with authorized parties</li>
                <li>• Report any suspicious verification requests</li>
                <li>• Download PDF copies for your records</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
