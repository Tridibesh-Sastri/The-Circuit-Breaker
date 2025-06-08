import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  name: string
  progress: number
  status: "planning" | "in-progress" | "review" | "completed"
  team: string[]
}

interface ProjectStatusProps {
  projects?: Project[]
  className?: string
}

export function ProjectStatus({ projects = [], className }: ProjectStatusProps) {
  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20"
      case "in-progress":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
      case "review":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
      default:
        return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20"
    }
  }

  if (!projects || projects.length === 0) {
    return (
      <Card className={cn("col-span-1", className)}>
        <CardHeader>
          <CardTitle>Project Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">No projects available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {projects.map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{project.name}</h3>
              <Badge className={cn("font-normal", getStatusColor(project.status))}>
                {project.status
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            <div className="flex -space-x-2">
              {project.team &&
                project.team.map((member, index) => (
                  <div
                    key={index}
                    className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium border border-background"
                  >
                    {member.charAt(0)}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
