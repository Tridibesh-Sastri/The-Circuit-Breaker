"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Upload, X, Plus, FileText, BookOpen, FileQuestion, Cpu, Code, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

const resourceSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  author: z.string().min(2, {
    message: "Author name must be at least 2 characters.",
  }),
  resourceType: z.string({
    required_error: "Please select a resource type.",
  }),
  subject: z.string({
    required_error: "Please select a subject.",
  }),
  tags: z.string().min(3, {
    message: "Please enter at least one tag.",
  }),
  difficultyLevel: z.string().optional(),
  isPublic: z.boolean().default(true),
  prerequisites: z.string().optional(),
  externalLink: z.string().url().optional().or(z.literal("")),
})

export default function ResourceUploadPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [resourceFile, setResourceFile] = useState<File | null>(null)
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [previewMode, setPreviewMode] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [prerequisites, setPrerequisites] = useState<string[]>([])
  const [newPrerequisite, setNewPrerequisite] = useState("")

  const form = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      resourceType: "",
      subject: "",
      tags: "",
      difficultyLevel: "intermediate",
      isPublic: true,
      prerequisites: "",
      externalLink: "",
    },
  })

  const handleResourceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setResourceFile(file)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && !file.type.includes("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file for the thumbnail.",
        variant: "destructive",
      })
      return
    }
    setThumbnailImage(file)

    // Create preview
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setThumbnailPreview(null)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()]
      setTags(updatedTags)
      form.setValue("tags", updatedTags.join(","))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag)
    setTags(updatedTags)
    form.setValue("tags", updatedTags.join(","))
  }

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !prerequisites.includes(newPrerequisite.trim())) {
      const updatedPrerequisites = [...prerequisites, newPrerequisite.trim()]
      setPrerequisites(updatedPrerequisites)
      form.setValue("prerequisites", updatedPrerequisites.join(","))
      setNewPrerequisite("")
    }
  }

  const removePrerequisite = (prerequisite: string) => {
    const updatedPrerequisites = prerequisites.filter((p) => p !== prerequisite)
    setPrerequisites(updatedPrerequisites)
    form.setValue("prerequisites", updatedPrerequisites.join(","))
  }

  const onSubmit = async (values: z.infer<typeof resourceSchema>) => {
    try {
      setIsUploading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to upload a resource.",
          variant: "destructive",
        })
        return
      }

      let resourceFileUrl = null
      let thumbnailUrl = null

      // Upload resource file if provided
      if (resourceFile) {
        const fileExt = resourceFile.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}_resource.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resources")
          .upload(fileName, resourceFile)

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        // Get public URL
        const { data: urlData } = await supabase.storage.from("resources").getPublicUrl(fileName)
        resourceFileUrl = urlData.publicUrl
      }

      // Upload thumbnail if provided
      if (thumbnailImage) {
        const fileExt = thumbnailImage.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}_thumbnail.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resource-thumbnails")
          .upload(fileName, thumbnailImage)

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        // Get public URL
        const { data: urlData } = await supabase.storage.from("resource-thumbnails").getPublicUrl(fileName)
        thumbnailUrl = urlData.publicUrl
      }

      // Insert resource into database
      const { data, error } = await supabase
        .from("resources")
        .insert({
          title: values.title,
          description: values.description,
          author: values.author,
          uploader_id: user.id,
          resource_type: values.resourceType,
          subject: values.subject,
          file_url: resourceFileUrl,
          thumbnail_url: thumbnailUrl,
          tags: tags,
          difficulty_level: values.difficultyLevel,
          is_public: values.isPublic,
          prerequisites: prerequisites,
          external_link: values.externalLink || null,
        })
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Resource uploaded successfully!",
        description: "Your resource has been uploaded and is now available.",
      })

      router.push("/dashboard/resources")
      router.refresh()
    } catch (error) {
      console.error("Error uploading resource:", error)
      toast({
        title: "Error uploading resource",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode)
  }

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-5 w-5" />
      case "tutorial":
        return <FileText className="h-5 w-5" />
      case "question_paper":
        return <FileQuestion className="h-5 w-5" />
      case "datasheet":
        return <Cpu className="h-5 w-5" />
      case "code":
        return <Code className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Upload a Resource</h1>
          <p className="text-gray-400">Share educational materials with the electronics community</p>
        </div>
        <Button variant={previewMode ? "default" : "outline"} onClick={togglePreviewMode} className="gap-2">
          {previewMode ? (
            <>
              Edit <FileText className="h-4 w-4" />
            </>
          ) : (
            <>
              Preview <Eye className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {previewMode ? (
        <ResourcePreview
          formData={form.getValues()}
          thumbnailPreview={thumbnailPreview}
          resourceFile={resourceFile}
          tags={tags}
          prerequisites={prerequisites}
          resourceTypeIcon={getResourceTypeIcon(form.getValues().resourceType)}
          onBack={() => setPreviewMode(false)}
          onSubmit={() => form.handleSubmit(onSubmit)()}
          isSubmitting={isUploading}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="details">Resource Details</TabsTrigger>
                <TabsTrigger value="metadata">Metadata & Tags</TabsTrigger>
                <TabsTrigger value="files">Files & Links</TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <TabsContent value="details" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter resource title" {...field} />
                          </FormControl>
                          <FormDescription>Give your resource a descriptive title.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe this resource in detail..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Explain what this resource contains and how it can be useful.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter author name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Who created this resource? (You can enter your own name if you're the author)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="resourceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Resource Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select resource type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="book">Book</SelectItem>
                                <SelectItem value="tutorial">Tutorial</SelectItem>
                                <SelectItem value="question_paper">Question Paper</SelectItem>
                                <SelectItem value="datasheet">Datasheet</SelectItem>
                                <SelectItem value="code">Code Sample</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>What type of resource is this?</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Digital Electronics">Digital Electronics</SelectItem>
                                <SelectItem value="Analog Electronics">Analog Electronics</SelectItem>
                                <SelectItem value="Microcontrollers">Microcontrollers</SelectItem>
                                <SelectItem value="Communication Systems">Communication Systems</SelectItem>
                                <SelectItem value="Power Electronics">Power Electronics</SelectItem>
                                <SelectItem value="IoT">IoT</SelectItem>
                                <SelectItem value="Embedded Systems">Embedded Systems</SelectItem>
                                <SelectItem value="PCB Design">PCB Design</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>The subject area of this resource.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="difficultyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>How difficult is the content to understand?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Public Resource</FormLabel>
                            <FormDescription>Make this resource visible to all users</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setActiveTab("metadata")}>
                        Next
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="metadata" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Tags</h3>
                      <p className="text-sm text-gray-400 mb-4">Add tags to help others find your resource.</p>

                      <div className="flex gap-2 mb-4">
                        <Input
                          placeholder="Enter a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTag()
                            }
                          }}
                        />
                        <Button type="button" onClick={addTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic mb-4">No tags added yet.</p>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Add any prerequisites needed to understand this resource.
                      </p>

                      <div className="flex gap-2 mb-4">
                        <Input
                          placeholder="Enter a prerequisite"
                          value={newPrerequisite}
                          onChange={(e) => setNewPrerequisite(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addPrerequisite()
                            }
                          }}
                        />
                        <Button type="button" onClick={addPrerequisite}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {prerequisites.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {prerequisites.map((prerequisite, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1 px-3 py-1">
                              {prerequisite}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removePrerequisite(prerequisite)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic mb-4">No prerequisites added yet.</p>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                        Back
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("files")}>
                        Next
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="files" className="space-y-6">
                    <div>
                      <FormLabel htmlFor="resourceFile">Resource File</FormLabel>
                      <div className="mt-2">
                        {resourceFile ? (
                          <div className="relative mt-2 flex items-center rounded-md border p-2">
                            <div className="flex-1 truncate">
                              <p className="text-sm font-medium">{resourceFile.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(resourceFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setResourceFile(null)}
                              className="ml-2 h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove file</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="flex w-full items-center justify-center rounded-md border border-dashed p-6">
                            <label htmlFor="resourceFile" className="flex cursor-pointer flex-col items-center gap-1">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm font-medium">Click to upload resource file</span>
                              <span className="text-xs text-muted-foreground">PDF, DOC, PPT, ZIP, etc. up to 10MB</span>
                              <Input
                                id="resourceFile"
                                type="file"
                                className="hidden"
                                onChange={handleResourceFileChange}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Upload the resource file that you want to share with others.
                      </p>
                    </div>

                    <div>
                      <FormLabel htmlFor="thumbnailImage">Thumbnail Image (Optional)</FormLabel>
                      <div className="mt-2">
                        {thumbnailImage ? (
                          <div className="relative mt-2 flex items-center rounded-md border p-2">
                            <div className="flex-1 truncate">
                              <p className="text-sm font-medium">{thumbnailImage.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(thumbnailImage.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setThumbnailImage(null)
                                setThumbnailPreview(null)
                              }}
                              className="ml-2 h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove file</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="flex w-full items-center justify-center rounded-md border border-dashed p-6">
                            <label htmlFor="thumbnailImage" className="flex cursor-pointer flex-col items-center gap-1">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm font-medium">Click to upload thumbnail</span>
                              <span className="text-xs text-muted-foreground">PNG, JPG or GIF up to 2MB</span>
                              <Input
                                id="thumbnailImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleThumbnailChange}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Upload a thumbnail image to make your resource more visually appealing.
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="externalLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>External Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/resource" {...field} />
                          </FormControl>
                          <FormDescription>If this resource is available online, provide the URL.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("metadata")}>
                        Back
                      </Button>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={togglePreviewMode}>
                          Preview <Eye className="ml-2 h-4 w-4" />
                        </Button>
                        <Button type="submit" disabled={isUploading}>
                          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isUploading ? "Uploading..." : "Upload Resource"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface ResourcePreviewProps {
  formData: any
  thumbnailPreview: string | null
  resourceFile: File | null
  tags: string[]
  prerequisites: string[]
  resourceTypeIcon: React.ReactNode
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

function ResourcePreview({
  formData,
  thumbnailPreview,
  resourceFile,
  tags,
  prerequisites,
  resourceTypeIcon,
  onBack,
  onSubmit,
  isSubmitting,
}: ResourcePreviewProps) {
  const getResourceTypeName = (type: string) => {
    switch (type) {
      case "book":
        return "Book"
      case "tutorial":
        return "Tutorial"
      case "question_paper":
        return "Question Paper"
      case "datasheet":
        return "Datasheet"
      case "code":
        return "Code Sample"
      default:
        return "Resource"
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {resourceTypeIcon}
            <CardTitle className="text-2xl">{formData.title || "Untitled Resource"}</CardTitle>
          </div>
          <CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.subject && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {formData.subject}
                </Badge>
              )}
              {formData.difficultyLevel && (
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {formData.difficultyLevel.charAt(0).toUpperCase() + formData.difficultyLevel.slice(1)} Level
                </Badge>
              )}
              {formData.resourceType && (
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  {getResourceTypeName(formData.resourceType)}
                </Badge>
              )}
              {!formData.isPublic && (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                  Private
                </Badge>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Thumbnail */}
          {thumbnailPreview && (
            <div className="rounded-lg overflow-hidden border">
              <img
                src={thumbnailPreview || "/placeholder.svg"}
                alt="Resource thumbnail"
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-400 whitespace-pre-line">{formData.description || "No description provided."}</p>
          </div>

          {/* Author */}
          <div>
            <h3 className="text-lg font-medium mb-2">Author</h3>
            <p className="text-gray-400">{formData.author}</p>
          </div>

          {/* File */}
          {resourceFile && (
            <div>
              <h3 className="text-lg font-medium mb-2">Resource File</h3>
              <div className="flex items-center gap-2 p-3 border rounded-md">
                <FileText className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium">{resourceFile.name}</p>
                  <p className="text-sm text-gray-400">{(resourceFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
          )}

          {/* External Link */}
          {formData.externalLink && (
            <div>
              <h3 className="text-lg font-medium mb-2">External Link</h3>
              <a
                href={formData.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                {formData.externalLink}
              </a>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
              <div className="flex flex-wrap gap-2">
                {prerequisites.map((prerequisite, index) => (
                  <Badge key={index} variant="outline">
                    {prerequisite}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back to Edit
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Uploading..." : "Upload Resource"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
