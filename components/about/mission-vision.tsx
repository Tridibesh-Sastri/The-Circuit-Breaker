import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircuitBoardIcon as CircuitIcon, LightbulbIcon, UsersIcon } from "lucide-react"

export function MissionVision() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Our Mission</CardTitle>
          <CircuitIcon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To foster a collaborative environment where students can explore, learn, and innovate in the field of
            electronics and circuit design, while developing practical skills that complement their academic knowledge.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Our Vision</CardTitle>
          <LightbulbIcon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To become a leading student-run electronics club that empowers members to transform theoretical concepts
            into practical applications, preparing them for future careers in electronics and related fields.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Our Values</CardTitle>
          <UsersIcon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Collaboration and teamwork</li>
            <li>Continuous learning and growth</li>
            <li>Innovation and creativity</li>
            <li>Knowledge sharing</li>
            <li>Inclusivity and diversity</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
