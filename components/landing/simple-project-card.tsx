import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, User } from "lucide-react"
import Image from "next/image"

interface SimpleProjectCardProps {
  project: {
    id: number
    title: string
    description: string
    image: string
    tags: string[]
    author: string
    likes: number
    difficulty: "Beginner" | "Intermediate" | "Advanced"
  }
}

export function SimpleProjectCard({ project }: SimpleProjectCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-gray-900/50 border-white/10 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 group">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className={getDifficultyColor(project.difficulty)}>{project.difficulty}</Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg line-clamp-1">{project.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs border-gray-500/30 text-gray-400">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <User className="h-4 w-4" />
            <span>{project.author}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Heart className="h-4 w-4" />
            <span>{project.likes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
