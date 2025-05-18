import Image from "next/image"
import { Cpu, ChevronRight } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  title: string
  author: string
  year: string
  components: string[]
  image: string
  tags: string[]
}

export function ProjectCard({ title, author, year, components, image, tags }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden bg-gray-900/60 border-white/10 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">{title}</h3>
          <Cpu className="h-5 w-5 text-blue-500" />
        </div>
        <p className="text-sm text-gray-400">
          By {author} • {year}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Components:</p>
          <p className="text-sm text-gray-300">{components.join(", ")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/30"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          className="w-full justify-between text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        >
          View Project <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
