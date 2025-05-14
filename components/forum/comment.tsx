"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, Heart, Smile, MessageSquare, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CommentProps {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatarUrl?: string
  }
  createdAt: Date
  reactions: {
    like: number
    love: number
    wow: number
  }
  replies?: CommentProps[]
  currentUserId?: string
  onReply?: (parentId: string, content: string) => void
  onReact?: (commentId: string, reactionType: "like" | "love" | "wow") => void
  onEdit?: (commentId: string, content: string) => void
  onDelete?: (commentId: string) => void
}

export function Comment({
  id,
  content,
  author,
  createdAt,
  reactions,
  replies = [],
  currentUserId,
  onReply,
  onReact,
  onEdit,
  onDelete,
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [editContent, setEditContent] = useState(content)

  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true })
  const isAuthor = currentUserId === author.id
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleReplySubmit = () => {
    if (replyContent.trim() && onReply) {
      onReply(id, replyContent)
      setReplyContent("")
      setIsReplying(false)
    }
  }

  const handleEditSubmit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(id, editContent)
      setIsEditing(false)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={author.avatarUrl || "/placeholder.svg"} alt={author.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="rounded-lg bg-muted p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{author.name}</span>
                <span className="text-xs text-muted-foreground">{timeAgo}</span>
              </div>
              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete && onDelete(id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {isEditing ? (
              <div className="mt-2">
                <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="mb-2" />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false)
                      setEditContent(content)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleEditSubmit}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{content}</p>
            )}
          </div>

          <div className="mt-1 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => onReact && onReact(id, "like")}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>{reactions.like}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => onReact && onReact(id, "love")}
            >
              <Heart className="h-3 w-3" />
              <span>{reactions.love}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => onReact && onReact(id, "wow")}
            >
              <Smile className="h-3 w-3" />
              <span>{reactions.wow}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MessageSquare className="h-3 w-3" />
              <span>Reply</span>
            </Button>
          </div>

          {isReplying && (
            <div className="mt-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsReplying(false)
                    setReplyContent("")
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleReplySubmit}>
                  Reply
                </Button>
              </div>
            </div>
          )}

          {replies.length > 0 && (
            <div className="mt-3 pl-4">
              {replies.map((reply) => (
                <Comment
                  key={reply.id}
                  {...reply}
                  currentUserId={currentUserId}
                  onReply={onReply}
                  onReact={onReact}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
