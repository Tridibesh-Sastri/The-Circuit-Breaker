import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, MessageSquare, Eye } from "lucide-react"

interface ForumPostCardProps {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatarUrl?: string
    role?: string
  }
  tags: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: Date
}

export function ForumPostCard({
  id,
  title,
  content,
  author,
  tags,
  viewCount,
  likeCount,
  commentCount,
  createdAt,
}: ForumPostCardProps) {
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true })
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <Link href={`/dashboard/forum/${id}`}>
            <h3 className="text-xl font-semibold hover:underline">{title}</h3>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{viewCount}</span>
          </div>
        </div>
        <p className="mb-4 line-clamp-2 text-sm">{content}</p>
        <div className="mb-4 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={author.avatarUrl || "/placeholder.svg"} alt={author.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{author.name}</span>
          {author.role && (
            <Badge
              variant="outline"
              className={`text-xs ${
                author.role === "admin"
                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                  : author.role === "moderator"
                    ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                    : author.role === "member"
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
              }`}
            >
              {author.role}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{commentCount}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
