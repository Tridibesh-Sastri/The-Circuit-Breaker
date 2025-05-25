"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, FileText, Youtube, Cpu, Upload, X, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

export default function NewResourcePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resourceType, setResourceType] = useState<string>("book")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState<string>("")
  const [prerequisites, setPrerequisites] = useState<string[]>([])
  const [currentPrerequisite, setCurrentPrerequisite] = useState<string>("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [resourceFile, setResourceFile] = useState<File | null>(null)

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleResourceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResourceFile(e.target.files[0])
    }
  }

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addPrerequisite = () => {
    if (currentPrerequisite && !prerequisites.includes(currentPrerequisite)) {
      setPrerequisites([...prerequisites, currentPrerequisite])
      setCurrentPrerequisite("")
    }
  }

  const removePrerequisite = (prerequisiteToRemove: string) => {
    setPrerequisites(prerequisites.filter((prerequisite) => prerequisite !== prerequisiteToRemove))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get("title") as string
      const description = formData.get("description") as string
      const author = formData.get("author") as string
      const url = formData.get("url") as string
      const difficulty = formData.get("difficulty") as string

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      let thumbnailUrl = null
      let fileUrl = null

      // Upload thumbnail if exists
      if (thumbnailFile) {
        const { data: thumbnailData, error: thumbnailError } = await supabase.storage
          .from("resource-thumbnails")
          .upload(`${user.id}/${Date.now()}-${thumbnailFile.name}`, thumbnailFile)

        if (thumbnailError) {
          throw thumbnailError
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("resource-thumbnails").getPublicUrl(thumbnailData.path)

        thumbnailUrl = publicUrl
      }

      // Upload resource file if exists
      if (resourceFile) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from("resource-files")
          .upload(`${user.id}/${Date.now()}-${resourceFile.name}`, resourceFile)

        if (fileError) {
          throw fileError
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("resource-files").getPublicUrl(fileData.path)

        fileUrl = publicUrl
      }

      // Insert resource into database
      const { data, error } = await supabase
        .from("resources")
        .insert({
          title,
          description,
          type: resourceType,
          url: url || null,
          file_url: fileUrl,
          thumbnail_url: thumbnailUrl,
          author: author || null,
          tags: tags.length > 0 ? tags : null,
          prerequisites: prerequisites.length > 0 ? prerequisites : null,
          difficulty_level: difficulty || null,
          uploader_id: user.id,
          is_approved: false, // Requires admin approval
        })
        .select()

      if (error) {
        throw error
      }

      // Redirect to library page
      router.push("/dashboard/library")
      router.refresh()
    } catch (error) {
      console.error("Error uploading resource:", error)
      alert("Failed to upload resource. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Resource</h1>
        <p className="text-gray-400">Share educational materials with the community.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-gray-900/60 border-white/10">
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
            <CardDescription>Provide information about the resource you're sharing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resource Type */}
            <div className="space-y-3">
              <Label>Resource Type</Label>
              <RadioGroup
                defaultValue="book"
                value={resourceType}
                onValueChange={setResourceType}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="book" id="book" />
                  <Label htmlFor="book" className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="h-5 w-5 text-emerald-500" />
                    Book
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tutorial" id="tutorial" />
                  <Label htmlFor="tutorial" className="flex items-center gap-2 cursor-pointer">
                    <Youtube className="h-5 w-5 text-red-500" />
                    Tutorial
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="question_paper" id="question_paper" />
                  <Label htmlFor="question_paper" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Question Paper
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="datasheet" id="datasheet" />
                  <Label htmlFor="datasheet" className="flex items-center gap-2 cursor-pointer">
                    <Cpu className="h-5 w-5 text-purple-500" />
                    Datasheet
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Title and Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Resource title"
                  required
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" placeholder="Author name" className="bg-gray-800 border-gray-700" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the resource..."
                required
                className="min-h-[100px] bg-gray-800 border-gray-700"
              />
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url">URL (Optional)</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com/resource"
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-400">
                {resourceType === "tutorial" ? "Link to YouTube video or playlist" : "Link to external resource"}
              </p>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select name="difficulty">
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  className="bg-gray-800 border-gray-700"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="border-white/10 text-white hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30 flex items-center gap-1"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Prerequisites */}
            <div className="space-y-2">
              <Label>Prerequisites</Label>
              <div className="flex gap-2">
                <Input
                  value={currentPrerequisite}
                  onChange={(e) => setCurrentPrerequisite(e.target.value)}
                  placeholder="Add a prerequisite"
                  className="bg-gray-800 border-gray-700"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addPrerequisite()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPrerequisite}
                  className="border-white/10 text-white hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {prerequisites.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {prerequisites.map((prerequisite) => (
                    <Badge
                      key={prerequisite}
                      variant="outline"
                      className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/30 flex items-center gap-1"
                    >
                      {prerequisite}
                      <button
                        type="button"
                        onClick={() => removePrerequisite(prerequisite)}
                        className="ml-1 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label>Thumbnail Image (Optional)</Label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="max-h-40 mx-auto rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => {
                        setThumbnailFile(null)
                        setThumbnailPreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG or GIF (max. 2MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className={thumbnailPreview ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                  onChange={handleThumbnailChange}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Resource File (Optional)</Label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                {resourceFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-sm truncate">{resourceFile.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setResourceFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOCX, etc. (max. 10MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  className={resourceFile ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                  onChange={handleResourceFileChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-white/10 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-500 text-black hover:bg-emerald-600">
              {isSubmitting ? "Uploading..." : "Upload Resource"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
