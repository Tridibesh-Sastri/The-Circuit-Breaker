"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Shell } from "@/components/shell"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Textarea } from "@/components/ui/textarea"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

interface Comment {
  id: string
  content: string
  created_at: string
  user: {
    id: string
    full_name: string
    avatar_url: string | null
    role: string | null
  }
}

interface Post {
  id: string
  title: string
  content: string
  created_at: string
  user: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

const ForumPostPage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { id: postId } = useParams()
  const [commentContent, setCommentContent] = useState("")
  const { data: session } = useSession()
  const supabase = useSupabaseClient()
  const queryClient = useQueryClient()

  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ["forum_posts", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(`
          *,
          user:profiles(id, full_name, avatar_url)
        `)
        .eq("id", postId)
        .single()

      if (error) {
        throw error
      }

      return data as Post
    },
  })

  const { data: comments, error: commentsError } = useQuery({
    queryKey: ["forum_comments", postId],
    queryFn: async () => {
      const { data: comments, error } = await supabase
        .from("forum_comments")
        .select(`
          *,
          user:profiles(id, full_name, avatar_url, role)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true })

      if (error) {
        throw error
      }

      return comments as Comment[]
    },
  })

  const createCommentMutation = useMutation({
    mutationFn: async (newComment: { content: string; post_id: string; user_id: string }) => {
      const { data, error } = await supabase
        .from("forum_comments")
        .insert([newComment])
        .select(`
          *,
          user:profiles(id, full_name, avatar_url, role)
        `)
        .single()

      if (error) {
        throw error
      }

      return data as Comment
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["forum_comments", postId])
      setCommentContent("")
      toast({
        title: "Comment created!",
        description: "Your comment has been successfully posted.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error creating comment",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleCreateComment = async () => {
    if (!session?.user?.id) {
      toast({
        title: "You must be logged in to comment.",
        variant: "destructive",
      })
      return
    }

    if (!commentContent.trim()) {
      toast({
        title: "Comment cannot be empty.",
        variant: "destructive",
      })
      return
    }

    await createCommentMutation.mutateAsync({
      content: commentContent,
      post_id: postId as string,
      user_id: session.user.id,
    })
  }

  if (isPostLoading) {
    return <div>Loading post...</div>
  }

  if (postError) {
    return <div>Error loading post: {postError.message}</div>
  }

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <Shell>
      <Card className="w-[100%]">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            Posted by {post.user.full_name} {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{post.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => router.back()}>Back to Forum</Button>
        </CardFooter>
      </Card>

      <Separator className="my-4" />

      <div className="mb-4">
        <Label htmlFor="comment">Add a Comment</Label>
        <Textarea
          id="comment"
          placeholder="Type your comment here..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="mt-2"
        />
        <Button onClick={handleCreateComment} className="mt-4">
          Post Comment
        </Button>
      </div>

      <Separator className="my-4" />

      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {commentsError && <div>Error loading comments: {commentsError.message}</div>}
      {comments?.length === 0 && <div>No comments yet. Be the first to comment!</div>}
      {comments &&
        comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-200 dark:border-gray-800 py-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatar_url || undefined} alt={comment.user.full_name} />
                <AvatarFallback>
                  {comment.user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.user.full_name}</span>
                  {comment.user.role && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        comment.user.role === "admin"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : comment.user.role === "moderator"
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            : comment.user.role === "member"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                      }`}
                    >
                      {comment.user.role}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-1">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
    </Shell>
  )
}

export default ForumPostPage
