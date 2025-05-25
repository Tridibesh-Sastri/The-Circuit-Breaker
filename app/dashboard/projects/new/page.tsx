"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Upload, X, Plus, User, Cpu, Youtube, FileText, ChevronRight, Eye } from "lucide-react"
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
import { DatePicker } from "@/components/ui/date-picker"

const projectSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  objective: z
    .string()
    .min(10, {
      message: "Objective must be at least 10 characters.",
    })
    .optional(),
  year: z.string().min(4, {
    message: "Please enter a valid year.",
  }),
  components: z.string().min(3, {
    message: "Please enter at least one component.",
  }),
  subject: z.string().min(1, {
    message: "Please select a subject.",
  }),
  tags: z.string().min(3, {
    message: "Please enter at least one tag.",
  }),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  difficulty: z.string().optional(),
  teamMembers: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.string().optional(),
})

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [circuitDiagram, setCircuitDiagram] = useState<File | null>(null)
  const [projectImages, setProjectImages] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [previewMode, setPreviewMode] = useState(false)
  const [teamMembers, setTeamMembers] = useState<string[]>([])
  const [newTeamMember, setNewTeamMember] = useState("")
  const [circuitDiagramPreview, setCircuitDiagramPreview] = useState<string | null>(null)
  const [projectImagesPreview, setProjectImagesPreview] = useState<string[]>([])

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      objective: "",
      year: new Date().getFullYear().toString(),
      components: "",
      subject: "",
      tags: "",
      youtubeUrl: "",
      difficulty: "intermediate",
      teamMembers: "",
      status: "planning",
    },
  })

  const handleCircuitDiagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && !file.type.includes("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file for the circuit diagram.",
        variant: "destructive",
      })
      return
    }
    setCircuitDiagram(file)

    // Create preview
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCircuitDiagramPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setCircuitDiagramPreview(null)
    }
  }

  const handleProjectImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles: File[] = []
    const newPreviews: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.includes("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files for project images.",
          variant: "destructive",
        })
        continue
      }
      newFiles.push(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === newFiles.length) {
          setProjectImagesPreview([...projectImagesPreview, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    }

    setProjectImages([...projectImages, ...newFiles])
  }

  const removeProjectImage = (index: number) => {
    const updatedImages = [...projectImages]
    updatedImages.splice(index, 1)
    setProjectImages(updatedImages)

    const updatedPreviews = [...projectImagesPreview]
    updatedPreviews.splice(index, 1)
    setProjectImagesPreview(updatedPreviews)
  }

  const addTeamMember = () => {
    if (newTeamMember.trim() && !teamMembers.includes(newTeamMember.trim())) {
      setTeamMembers([...teamMembers, newTeamMember.trim()])
      setNewTeamMember("")
    }
  }

  const removeTeamMember = (member: string) => {
    setTeamMembers(teamMembers.filter((m) => m !== member))
  }

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    try {
      setIsUploading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to submit a project.",
          variant: "destructive",
        })
        return
      }

      let circuitDiagramUrl = null
      const projectImageUrls: string[] = []

      // Upload circuit diagram if provided
      if (circuitDiagram) {
        const fileExt = circuitDiagram.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}_circuit.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("circuit-diagrams")
          .upload(fileName, circuitDiagram)

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        // Get public URL
        const { data: urlData } = await supabase.storage.from("circuit-diagrams").getPublicUrl(fileName)
        circuitDiagramUrl = urlData.publicUrl
      }

      // Upload project images if provided
      if (projectImages.length > 0) {
        for (let i = 0; i < projectImages.length; i++) {
          const image = projectImages[i]
          const fileExt = image.name.split(".").pop()
          const fileName = `${user.id}/${Date.now()}_${i}.${fileExt}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(fileName, image)

          if (uploadError) {
            throw new Error(uploadError.message)
          }

          // Get public URL
          const { data: urlData } = await supabase.storage.from("project-images").getPublicUrl(fileName)
          projectImageUrls.push(urlData.publicUrl)
        }
      }

      // Insert project into database
      const { data, error } = await supabase
        .from("projects")
        .insert({
          title: values.title,
          description: values.description,
          objective: values.objective,
          author_id: user.id,
          year: values.year,
          components: values.components.split(",").map((item) => item.trim()),
          circuit_diagram_url: circuitDiagramUrl,
          project_images: projectImageUrls,
          youtube_demo_url: values.youtubeUrl || null,
          tags: values.tags.split(",").map((item) => item.trim()),
          subject: values.subject,
          difficulty: values.difficulty,
          team: teamMembers,
          start_date: values.startDate ? values.startDate.toISOString() : null,
          end_date: values.endDate ? values.endDate.toISOString() : null,
          status: values.status,
        })
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Project submitted successfully!",
        description: "Your project has been submitted for approval.",
      })

      router.push("/dashboard/projects")
      router.refresh()
    } catch (error) {
      console.error("Error submitting project:", error)
      toast({
        title: "Error submitting project",
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Submit a New Project</h1>
          <p className="text-gray-400">Share your electronics project with the community</p>
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
        <ProjectPreview
          formData={form.getValues()}
          circuitDiagramPreview={circuitDiagramPreview}
          projectImagesPreview={projectImagesPreview}
          teamMembers={teamMembers}
          onBack={() => setPreviewMode(false)}
          onSubmit={() => form.handleSubmit(onSubmit)()}
          isSubmitting={isUploading}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="team">Team & Timeline</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <TabsContent value="details" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter project title" {...field} />
                          </FormControl>
                          <FormDescription>Give your project a descriptive title.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your project in detail..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Explain what your project does, how it works, and any challenges you faced.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Objective</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What was the goal of this project?"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Explain the purpose and goals of your project.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2023" {...field} />
                            </FormControl>
                            <FormDescription>The year when the project was created.</FormDescription>
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
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>The subject area of your project.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>How difficult is this project to build?</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="planning">Planning</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="on_hold">On Hold</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Current status of the project</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., arduino, led, timer, beginner" {...field} />
                          </FormControl>
                          <FormDescription>
                            Add tags to help others find your project, separated by commas.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setActiveTab("team")}>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="team" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Team Members</h3>
                      <p className="text-sm text-gray-400 mb-4">Add the people who contributed to this project.</p>

                      <div className="flex gap-2 mb-4">
                        <Input
                          placeholder="Enter team member name"
                          value={newTeamMember}
                          onChange={(e) => setNewTeamMember(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTeamMember()
                            }
                          }}
                        />
                        <Button type="button" onClick={addTeamMember}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {teamMembers.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {teamMembers.map((member, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                              <User className="h-3 w-3" />
                              {member}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removeTeamMember(member)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic mb-4">No team members added yet.</p>
                      )}
                    </div>

                    <Separator />

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <DatePicker date={field.value} setDate={field.onChange} />
                            </FormControl>
                            <FormDescription>When did you start working on this project?</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <DatePicker date={field.value} setDate={field.onChange} />
                            </FormControl>
                            <FormDescription>When did you complete this project?</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                        Back
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("components")}>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="components" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="components"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Components Used</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Arduino Uno, 555 Timer, LEDs, Resistors"
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            List the components used in your project, separated by commas. Include specific part numbers
                            where relevant.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("team")}>
                        Back
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("media")}>
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-6">
                    <div>
                      <FormLabel htmlFor="circuitDiagram">Circuit Diagram</FormLabel>
                      <div className="mt-2">
                        {circuitDiagram ? (
                          <div className="relative mt-2 flex items-center rounded-md border p-2">
                            <div className="flex-1 truncate">
                              <p className="text-sm font-medium">{circuitDiagram.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(circuitDiagram.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCircuitDiagram(null)
                                setCircuitDiagramPreview(null)
                              }}
                              className="ml-2 h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove file</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="flex w-full items-center justify-center rounded-md border border-dashed p-6">
                            <label htmlFor="circuitDiagram" className="flex cursor-pointer flex-col items-center gap-1">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm font-medium">Click to upload circuit diagram</span>
                              <span className="text-xs text-muted-foreground">PNG, JPG or GIF up to 5MB</span>
                              <Input
                                id="circuitDiagram"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCircuitDiagramChange}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Upload an image of your circuit diagram to help others understand your project.
                      </p>
                    </div>

                    <div>
                      <FormLabel htmlFor="projectImages">Project Images</FormLabel>
                      <div className="mt-2">
                        <div className="flex w-full items-center justify-center rounded-md border border-dashed p-6">
                          <label htmlFor="projectImages" className="flex cursor-pointer flex-col items-center gap-1">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm font-medium">Click to upload project images</span>
                            <span className="text-xs text-muted-foreground">PNG, JPG or GIF up to 5MB each</span>
                            <Input
                              id="projectImages"
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handleProjectImagesChange}
                            />
                          </label>
                        </div>
                      </div>

                      {projectImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {projectImagesPreview.map((preview, index) => (
                            <div key={index} className="relative rounded-md overflow-hidden border">
                              <img
                                src={preview || "/placeholder.svg"}
                                alt={`Project image ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeProjectImage(index)}
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="mt-2 text-xs text-muted-foreground">
                        Upload images of your project to showcase your work.
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="youtubeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube Demo URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                          </FormControl>
                          <FormDescription>
                            If you have a video demonstration, paste the YouTube URL here.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("components")}>
                        Back
                      </Button>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={togglePreviewMode}>
                          Preview <Eye className="ml-2 h-4 w-4" />
                        </Button>
                        <Button type="submit" disabled={isUploading}>
                          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isUploading ? "Submitting..." : "Submit Project"}
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

interface ProjectPreviewProps {
  formData: any
  circuitDiagramPreview: string | null
  projectImagesPreview: string[]
  teamMembers: string[]
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

function ProjectPreview({
  formData,
  circuitDiagramPreview,
  projectImagesPreview,
  teamMembers,
  onBack,
  onSubmit,
  isSubmitting,
}: ProjectPreviewProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not specified"
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{formData.title || "Untitled Project"}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.subject && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {formData.subject}
                </Badge>
              )}
              {formData.difficulty && (
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)} Difficulty
                </Badge>
              )}
              {formData.status && (
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  {formData.status.replace("_", " ").charAt(0).toUpperCase() +
                    formData.status.replace("_", " ").slice(1)}
                </Badge>
              )}
              <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30">
                {formData.year}
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Images */}
          {projectImagesPreview.length > 0 && (
            <div className="rounded-lg overflow-hidden border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                <div className="md:col-span-2">
                  <img
                    src={projectImagesPreview[0] || "/placeholder.svg"}
                    alt="Project main image"
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
                {projectImagesPreview.slice(1, 5).map((preview, index) => (
                  <img
                    key={index}
                    src={preview || "/placeholder.svg"}
                    alt={`Project image ${index + 2}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
                {projectImagesPreview.length > 5 && (
                  <div className="relative">
                    <img
                      src={projectImagesPreview[5] || "/placeholder.svg"}
                      alt="Project image 6"
                      className="w-full h-32 object-cover rounded-md brightness-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                      +{projectImagesPreview.length - 5} more
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-400 whitespace-pre-line">{formData.description || "No description provided."}</p>
          </div>

          {/* Objective */}
          {formData.objective && (
            <div>
              <h3 className="text-lg font-medium mb-2">Objective</h3>
              <p className="text-gray-400 whitespace-pre-line">{formData.objective}</p>
            </div>
          )}

          {/* Team Members */}
          <div>
            <h3 className="text-lg font-medium mb-2">Team</h3>
            {teamMembers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((member, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 px-3 py-1">
                    <User className="h-3 w-3" />
                    {member}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No team members specified.</p>
            )}
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-medium mb-2">Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="text-gray-400">{formatDate(formData.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="text-gray-400">{formatDate(formData.endDate)}</p>
              </div>
            </div>
          </div>

          {/* Components */}
          <div>
            <h3 className="text-lg font-medium mb-2">Components Used</h3>
            {formData.components ? (
              <div className="flex flex-wrap gap-2">
                {formData.components.split(",").map((component: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    <Cpu className="h-3 w-3" />
                    {component.trim()}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No components specified.</p>
            )}
          </div>

          {/* Circuit Diagram */}
          {circuitDiagramPreview && (
            <div>
              <h3 className="text-lg font-medium mb-2">Circuit Diagram</h3>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={circuitDiagramPreview || "/placeholder.svg"}
                  alt="Circuit diagram"
                  className="w-full max-h-96 object-contain"
                />
              </div>
            </div>
          )}

          {/* YouTube Demo */}
          {formData.youtubeUrl && (
            <div>
              <h3 className="text-lg font-medium mb-2">Video Demonstration</h3>
              <div className="flex items-center gap-2 text-blue-400">
                <Youtube className="h-5 w-5" />
                <a href={formData.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {formData.youtubeUrl}
                </a>
              </div>
            </div>
          )}

          {/* Tags */}
          {formData.tags && (
            <div>
              <h3 className="text-lg font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {formData.tags.split(",").map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                    {tag.trim()}
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
            {isSubmitting ? "Submitting..." : "Submit Project"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
