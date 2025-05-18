"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  year: z.string().min(4, {
    message: "Please enter a valid year.",
  }),
  components: z.string().min(3, {
    message: "Please enter at least one component.",
  }),
  subject: z.string().optional(),
  tags: z.string().min(3, {
    message: "Please enter at least one tag.",
  }),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
})

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [circuitDiagram, setCircuitDiagram] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      year: new Date().getFullYear().toString(),
      components: "",
      subject: "",
      tags: "",
      youtubeUrl: "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

      // Upload circuit diagram if provided
      if (circuitDiagram) {
        const fileExt = circuitDiagram.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

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

      // Insert project into database
      const { data, error } = await supabase
        .from("projects")
        .insert({
          title: values.title,
          description: values.description,
          author_id: user.id,
          year: values.year,
          components: values.components.split(",").map((item) => item.trim()),
          circuit_diagram_url: circuitDiagramUrl,
          youtube_demo_url: values.youtubeUrl || null,
          tags: values.tags.split(",").map((item) => item.trim()),
          subject: values.subject || null,
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Submit a New Project</h1>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <Textarea placeholder="Describe your project in detail..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormDescription>
                      Explain what your project does, how it works, and any challenges you faced.
                    </FormDescription>
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

              <FormField
                control={form.control}
                name="components"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Components Used</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Arduino Uno, 555 Timer, LEDs, Resistors" {...field} />
                    </FormControl>
                    <FormDescription>List the components used in your project, separated by commas.</FormDescription>
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
                      <Input placeholder="e.g., arduino, led, timer, beginner" {...field} />
                    </FormControl>
                    <FormDescription>Add tags to help others find your project, separated by commas.</FormDescription>
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
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormDescription>If you have a video demonstration, paste the YouTube URL here.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel htmlFor="circuitDiagram">Circuit Diagram (Optional)</FormLabel>
                <div className="mt-2">
                  {circuitDiagram ? (
                    <div className="relative mt-2 flex items-center rounded-md border p-2">
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium">{circuitDiagram.name}</p>
                        <p className="text-xs text-muted-foreground">{(circuitDiagram.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCircuitDiagram(null)}
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
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Upload an image of your circuit diagram to help others understand your project.
                </p>
              </div>

              <Button type="submit" disabled={isUploading} className="w-full">
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Submitting..." : "Submit Project"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
