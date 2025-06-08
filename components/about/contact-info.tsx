import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Globe } from "lucide-react"

export function ContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-start gap-4">
          <Mail className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h4 className="font-medium">Email</h4>
            <p className="text-sm text-muted-foreground">
              <a href="mailto:thecktbreakers@gmail.com" className="hover:underline">
                thecktbreakers@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MapPin className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h4 className="font-medium">Address</h4>
            <p className="text-sm text-muted-foreground">
              University Institute of Technology
              <br />
              Burdwan University
              <br />
              Golapbag, Burdwan
              <br />
              West Bengal, India
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Globe className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h4 className="font-medium">Social Media</h4>
            <div className="mt-1 flex gap-3">
              <a href="#" className="text-sm text-primary hover:underline">
                Instagram
              </a>
              <a href="#" className="text-sm text-primary hover:underline">
                LinkedIn
              </a>
              <a href="#" className="text-sm text-primary hover:underline">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
