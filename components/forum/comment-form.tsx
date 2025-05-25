"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommentFormProps {
  parentId?: string
  onSubmit?: (content: string, parentId?: string) => void
  placeholder?: string
  buttonText?: string
  defaultAvatar?: string
}

export function CommentForm({
  parentId,
  onSubmit,
  placeholder = "Write a comment...",
  buttonText = "Post Comment",
  defaultAvatar = "/placeholder.svg?height=32&width=32",
}: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      // Call the onSubmit handler provided by the parent component
      if (onSubmit) {
        const result = await onSubmit(content, parentId)

        if (result?.error) {
          alert(result.error)
          return
        }

        // Reset form on success
        setContent("")

        // Refresh the page to show the new comment
        window.location.reload()
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
      alert("Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={defaultAvatar || "/placeholder.svg"} alt="Your avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Textarea
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? "Posting..." : buttonText}
        </Button>
      </div>
    </form>
  )
}
