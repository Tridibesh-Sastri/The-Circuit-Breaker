import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TeamMemberCardProps {
  name: string
  designation: string
  branch: string
  year: string
  email?: string
  imageUrl?: string
}

export function TeamMemberCard({
  name,
  designation,
  branch,
  year,
  email,
  imageUrl = "/placeholder.svg?height=100&width=100",
}: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full">
            <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold">{name}</h3>
            <Badge variant="outline" className="my-1">
              {designation}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {branch}, {year} Year
            </p>
            {email && (
              <a href={`mailto:${email}`} className="mt-1 text-sm text-primary hover:underline">
                {email}
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
