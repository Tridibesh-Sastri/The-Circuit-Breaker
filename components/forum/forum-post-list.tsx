import { ForumPostCard } from "./forum-post-card"
import { Button } from "@/components/ui/button"

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatarUrl?: string
  }
  tags: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: Date
}

interface ForumPostListProps {
  posts: ForumPost[]
}

export function ForumPostList({ posts }: ForumPostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <ForumPostCard
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          author={post.author}
          tags={post.tags}
          viewCount={post.viewCount}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          createdAt={post.createdAt}
        />
      ))}

      <div className="mt-6 flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}
