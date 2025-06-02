"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Reply, MoreHorizontal } from "lucide-react"
import { CommentForm } from "./comment-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CommentProps {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatarUrl?: string
    role?: string
  }
  createdAt: Date
  likes: number
  replies?: CommentProps[]
  onReply?: (content: string, parentId: string) => void
  onLike?: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string, content: string) => void
  currentUserId?: string
}

export function Comment({
  id,
  content,
  author,
  createdAt,
  likes,
  replies = [],
  onReply,
  onLike,
  onDelete,
  onEdit,
  currentUserId,
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const isAuthor = currentUserId === author.id

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleReplySubmit = (content: string) => {
    if (onReply) {
      onReply(content, id)
      setIsReplying(false)
    }
  }

  const handleEditSubmit = () => {
    if (onEdit) {
      onEdit(id, editedContent)
      setIsEditing(false)
    }
  }

  // Function to get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-500 hover:bg-red-600"
      case "moderator":
        return "bg-blue-500 hover:bg-blue-600"
      case "mentor":
        return "bg-green-500 hover:bg-green-600"
      case "member":
        return "bg-purple-500 hover:bg-purple-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-900/60 rounded-lg p-4 border border-white/10">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author.avatarUrl || "/placeholder.svg"} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{author.name}</span>
              {author.role && <Badge className={`text-xs ${getRoleBadgeColor(author.role)}`}>{author.role}</Badge>}
              <span className="text-xs text-gray-400">{formatDate(createdAt)}</span>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleEditSubmit}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-200">{content}</p>
            )}

            <div className="flex items-center gap-4 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-white"
                onClick={() => onLike && onLike(id)}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {likes} {likes === 1 ? "Like" : "Likes"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-white"
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>

              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem onClick={() => setIsEditing(true)} className="text-white">
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete && onDelete(id)} className="text-red-400">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-8">
          <CommentForm
            parentId={id}
            onSubmit={handleReplySubmit}
            placeholder="Write a reply..."
            buttonText="Post Reply"
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="ml-8 space-y-4">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              {...reply}
              onReply={onReply}
              onLike={onLike}
              onDelete={onDelete}
              onEdit={onEdit}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
