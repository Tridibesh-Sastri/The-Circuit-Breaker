"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagInput } from "./tag-input"

interface NewPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewPostDialog({ open, onOpenChange }: NewPostDialogProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !category) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be a call to your API
      // await createForumPost({ title, content, category, tags })

      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form and close dialog
      setTitle("")
      setContent("")
      setCategory("")
      setTags([])
      onOpenChange(false)

      // Navigate to the new post (in a real app, this would go to the actual post)
      // router.push(`/dashboard/forum/post/${newPostId}`)
      router.refresh()
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>Share your questions, ideas, or projects with the community.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Discussion</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="tutorials">Tutorials</SelectItem>
                  <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                  <SelectItem value="components">Components</SelectItem>
                  <SelectItem value="tools">Tools & Equipment</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Describe your post in detail..."
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <TagInput
                id="tags"
                placeholder="Add tags (press Enter after each tag)"
                tags={tags}
                setTags={setTags}
                maxTags={5}
              />
              <p className="text-xs text-muted-foreground">Add up to 5 tags to help others find your post</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
