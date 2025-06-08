import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function ClubHistory() {
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[300px]">
          <Image
            src="/placeholder.svg?height=600&width=800"
            alt="The Circuit Breaker Electronics Club"
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="flex flex-col justify-center p-6">
          <h3 className="mb-4 text-2xl font-bold">Our History</h3>
          <div className="space-y-4 text-sm">
            <p>
              The Circuit Breaker Electronics Club was founded in 2022 by a group of passionate electronics engineering
              students from the University Institute of Technology, Burdwan University, who recognized the need for a
              platform where students could explore electronics beyond the classroom.
            </p>
            <p>
              What began as informal gatherings to discuss circuit designs and troubleshoot projects has evolved into a
              structured club with dedicated teams focusing on projects, academics, events, and media outreach.
            </p>
            <p>
              Today, the club serves as a hub for electronics enthusiasts across the university, organizing workshops,
              competitions, and collaborative projects that bridge the gap between theoretical knowledge and practical
              application.
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
