import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

interface RelatedPost {
  id: string
  title: string
  commentCount: number
}

interface ForumSidebarProps {
  relatedPosts: RelatedPost[]
}

export function ForumSidebar({ relatedPosts }: ForumSidebarProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Related Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relatedPosts.map((post) => (
              <div key={post.id} className="space-y-1">
                <Link href={`/dashboard/forum/post/${post.id}`} className="block font-medium hover:underline">
                  {post.title}
                </Link>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  <span>{post.commentCount} comments</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forum Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>Be respectful and constructive in your comments</li>
            <li>Stay on topic and avoid off-topic discussions</li>
            <li>Don't post spam or promotional content</li>
            <li>Use appropriate language and avoid offensive content</li>
            <li>Respect others' intellectual property</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
