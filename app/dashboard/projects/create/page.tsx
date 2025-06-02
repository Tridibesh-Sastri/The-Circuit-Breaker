"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Upload, X, ArrowLeft, Calendar, Users, Cpu, Link } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const projectSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  objective: z.string().min(10, { message: "Objective must be at least 10 characters" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  components: z.string().min(3, { message: "Please list at least one component" }),
  tags: z.string().min(3, { message: "Please add at least one tag" }),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  teamMembers: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

const subjects = [
  "Digital Electronics",
  "Analog Electronics",
  "Microcontrollers",
  "Communication Systems",
  "Power Electronics",
  "IoT",
  "Embedded Systems",
  "PCB Design",
  "Signal Processing",
  "Control Systems",
  "Other",
]

export default function CreateProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [circuitDiagram, setCircuitDiagram] = useState<File | null>(null)
  const [circuitPreview, setCircuitPreview] = useState<string | null>(null)
  const [projectImage, setProjectImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const circuitInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      objective: "",
      subject: "",
      components: "",
      tags: "",
      youtubeUrl: "",
      teamMembers: "",
    },
  })

  const handleCircuitDiagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Circuit diagram must be less than 10MB",
          variant: "destructive",
        })
        return
      }
      setCircuitDiagram(file)
      setCircuitPreview(URL.createObjectURL(file))
    }
  }

  const handleProjectImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Project image must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      setProjectImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setIsSubmitting(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create a project",
          variant: "destructive",
        })
        return
      }

      let circuitDiagramUrl = null
      let projectImageUrl = null

      // Upload circuit diagram if exists
      if (circuitDiagram) {
        const fileExt = circuitDiagram.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `circuit-diagrams/${fileName}`

        const { error: uploadError } = await supabase.storage.from("circuit-diagrams").upload(filePath, circuitDiagram)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage.from("circuit-diagrams").getPublicUrl(filePath)
        circuitDiagramUrl = publicUrlData.publicUrl
      }

      // Upload project image if exists
      if (projectImage) {
        const fileExt = projectImage.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `project-images/${fileName}`

        const { error: uploadError } = await supabase.storage.from("project-images").upload(filePath, projectImage)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage.from("project-images").getPublicUrl(filePath)
        projectImageUrl = publicUrlData.publicUrl
      }

      // Process components, tags, and team members
      const componentsArray = values.components.split(",").map((item) => item.trim())
      const tagsArray = values.tags.split(",").map((tag) => tag.trim())
      const teamMembersArray = values.teamMembers ? values.teamMembers.split(",").map((member) => member.trim()) : []

      // Insert project into database
      const { data, error } = await supabase
        .from("projects")
        .insert({
          title: values.title,
          description: values.description,
          objective: values.objective,
          author_id: user.id,
          co_authors: teamMembersArray.length > 0 ? teamMembersArray : null,
          year: new Date().getFullYear().toString(),
          components: componentsArray,
          circuit_diagram_url: circuitDiagramUrl,
          project_image_url: projectImageUrl,
          youtube_demo_url: values.youtubeUrl || null,
          tags: tagsArray,
          subject: values.subject,
          start_date: values.startDate ? values.startDate.toISOString() : null,
          end_date: values.endDate ? values.endDate.toISOString() : null,
          is_approved: false, // Requires admin approval
        })
        .select()

      if (error) throw error

      toast({
        title: "Project created successfully",
        description: "Your project has been submitted for approval",
      })

      // Redirect to projects page
      router.push("/dashboard/projects")
      router.refresh()
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Creation failed",
        description: "There was an error creating your project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
        <p className="text-gray-400">Share your electronics project with the community</p>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="preview" disabled={!form.formState.isValid}>
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Provide details about your electronics project</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project title" {...field} className="bg-gray-800 border-gray-700" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Area</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-800 border-gray-700">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teamMembers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Members (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe, Jane Smith (comma separated)"
                              {...field}
                              className="bg-gray-800 border-gray-700"
                            />
                          </FormControl>
                          <FormDescription>List other contributors to this project</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your project in detail..."
                            className="min-h-[120px] bg-gray-800 border-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Explain what your project does, how it works, and any challenges you faced
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
                            className="min-h-[80px] bg-gray-800 border-gray-700"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-gray-800 border-gray-700",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-gray-800 border-gray-700",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="components"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Components Used</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Arduino Uno, LEDs, Resistors (comma separated)"
                            {...field}
                            className="bg-gray-800 border-gray-700"
                          />
                        </FormControl>
                        <FormDescription>List the components used in your project, separated by commas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="arduino, led, beginner (comma separated)"
                            {...field}
                            className="bg-gray-800 border-gray-700"
                          />
                        </FormControl>
                        <FormDescription>
                          Add tags to help others find your project, separated by commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Demo URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            {...field}
                            className="bg-gray-800 border-gray-700"
                          />
                        </FormControl>
                        <FormDescription>If you have a video demonstration, paste the YouTube URL here</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div>
                      <FormLabel htmlFor="circuit-diagram">Circuit Diagram (Optional)</FormLabel>
                      <div
                        className="mt-2 border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800/50 transition-colors"
                        onClick={() => circuitInputRef.current?.click()}
                      >
                        {circuitPreview ? (
                          <div className="relative">
                            <img
                              src={circuitPreview || "/placeholder.svg"}
                              alt="Circuit diagram preview"
                              className="max-h-60 mx-auto rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                setCircuitDiagram(null)
                                setCircuitPreview(null)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="py-4">
                            <Upload className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Upload circuit diagram</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, SVG (max. 10MB)</p>
                          </div>
                        )}
                        <input
                          ref={circuitInputRef}
                          id="circuit-diagram"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCircuitDiagramChange}
                        />
                      </div>
                    </div>

                    <div>
                      <FormLabel htmlFor="project-image">Project Image (Optional)</FormLabel>
                      <div
                        className="mt-2 border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800/50 transition-colors"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Project image preview"
                              className="max-h-60 mx-auto rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                setProjectImage(null)
                                setImagePreview(null)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="py-4">
                            <Upload className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Upload project photo</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (max. 5MB)</p>
                          </div>
                        )}
                        <input
                          ref={imageInputRef}
                          id="project-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProjectImageChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="border-white/10 text-white hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-emerald-500 text-black hover:bg-emerald-600"
                    >
                      {isSubmitting ? "Creating..." : "Create Project"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle>Project Preview</CardTitle>
              <CardDescription>Preview how your project will appear to others</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {imagePreview && (
                  <div className="rounded-lg overflow-hidden max-h-[300px] flex items-center justify-center bg-black">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Project image"
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{form.watch("title") || "Project Title"}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                        {form.watch("subject") || "Subject"}
                      </Badge>

                      {form.watch("tags") &&
                        form
                          .watch("tags")
                          .split(",")
                          .map((tag, index) => (
                            <Badge key={index} variant="outline" className="bg-emerald-500/10 text-emerald-400">
                              {tag.trim()}
                            </Badge>
                          ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {form.watch("startDate") && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Started: {format(form.watch("startDate"), "PPP")}
                      </div>
                    )}

                    {form.watch("endDate") && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Completed: {format(form.watch("endDate"), "PPP")}
                      </div>
                    )}

                    {form.watch("teamMembers") && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Team: {form.watch("teamMembers")}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Description</h4>
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {form.watch("description") || "No description provided."}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Objective</h4>
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {form.watch("objective") || "No objective provided."}
                    </p>
                  </div>

                  {form.watch("components") && (
                    <div>
                      <h4 className="text-lg font-medium mb-2">Components Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {form
                          .watch("components")
                          .split(",")
                          .map((component, index) => (
                            <Badge key={index} variant="outline" className="bg-purple-500/10 text-purple-400">
                              <Cpu className="h-3 w-3 mr-1" />
                              {component.trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                  {circuitPreview && (
                    <div>
                      <h4 className="text-lg font-medium mb-2">Circuit Diagram</h4>
                      <div className="rounded-lg overflow-hidden border border-gray-700">
                        <img src={circuitPreview || "/placeholder.svg"} alt="Circuit diagram" className="max-w-full" />
                      </div>
                    </div>
                  )}

                  {form.watch("youtubeUrl") && (
                    <div>
                      <h4 className="text-lg font-medium mb-2">Video Demonstration</h4>
                      <a
                        href={form.watch("youtubeUrl")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                      >
                        <Link className="h-4 w-4" />
                        Watch on YouTube
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.trigger()}
                className="border-white/10 text-white hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Editing
              </Button>
              <Button
                type="button"
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isSubmitting}
                className="bg-emerald-500 text-black hover:bg-emerald-600"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
