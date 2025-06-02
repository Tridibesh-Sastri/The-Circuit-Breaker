import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare, ExternalLink } from "lucide-react"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  author: string
  year: string
  components: string[]
  tags: string[]
  subject?: string
  upvotes: number
  commentCount: number
  thumbnailUrl?: string
  youtubeUrl?: string
}

export function ProjectCard({
  id,
  title,
  description,
  author,
  year,
  components,
  tags,
  subject,
  upvotes,
  commentCount,
  thumbnailUrl = "/placeholder.svg?height=200&width=400",
  youtubeUrl,
}: ProjectCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image src={thumbnailUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-105"
            aria-label="Watch on YouTube"
          >
            <ExternalLink className="h-4 w-4 text-red-600" />
          </a>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline">{year}</Badge>
          {subject && <Badge variant="secondary">{subject}</Badge>}
        </div>
        <h3 className="mb-1 text-xl font-semibold">
          <Link href={`/dashboard/projects/${id}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        <p className="mb-2 text-sm text-muted-foreground">By {author}</p>
        <p className="mb-4 line-clamp-2 text-sm">{description}</p>
        <div className="mb-2 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
        <div className="mb-2">
          <p className="text-xs text-muted-foreground">Components:</p>
          <p className="line-clamp-1 text-xs">
            {components.slice(0, 3).join(", ")}
            {components.length > 3 && ` +${components.length - 3} more`}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-4 py-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
            <ThumbsUp className="h-4 w-4" />
            <span>{upvotes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
            <MessageSquare className="h-4 w-4" />
            <span>{commentCount}</span>
          </Button>
        </div>
        <Link href={`/dashboard/projects/${id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
