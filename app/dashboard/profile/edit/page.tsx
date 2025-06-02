"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Upload, X, Mail, Github, Linkedin, MapPin, Building, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const personalInfoSchema = z.object({
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    })
    .optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
})

const professionalInfoSchema = z.object({
  skills: z.string().optional(),
  github_url: z.string().url().optional().or(z.literal("")),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  company: z.string().optional(),
  position: z.string().optional(),
  graduation_year: z.string().optional(),
  institution: z.string().optional(),
  degree: z.string().optional(),
})

export default function ProfileEditPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [profile, setProfile] = useState<any>(null)

  const personalForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      full_name: "",
      username: "",
      bio: "",
      location: "",
      website: "",
    },
  })

  const professionalForm = useForm<z.infer<typeof professionalInfoSchema>>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      skills: "",
      github_url: "",
      linkedin_url: "",
      company: "",
      position: "",
      graduation_year: "",
      institution: "",
      degree: "",
    },
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to edit your profile.",
          variant: "destructive",
        })
        router.push("/auth")
        return
      }

      // Fetch user profile
      const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        throw error
      }

      if (profileData) {
        setProfile(profileData)

        // Set avatar preview if exists
        if (profileData.avatar_url) {
          setAvatarPreview(profileData.avatar_url)
        }

        // Set skills if exists
        if (profileData.skills && Array.isArray(profileData.skills)) {
          setSkills(profileData.skills)
        }

        // Set personal form values
        personalForm.reset({
          full_name: profileData.full_name || "",
          username: profileData.username || "",
          bio: profileData.bio || "",
          location: profileData.location || "",
          website: profileData.website || "",
        })

        // Set professional form values
        professionalForm.reset({
          skills: profileData.skills ? profileData.skills.join(", ") : "",
          github_url: profileData.github_url || "",
          linkedin_url: profileData.linkedin_url || "",
          company: profileData.company || "",
          position: profileData.position || "",
          graduation_year: profileData.graduation_year || "",
          institution: profileData.institution || "",
          degree: profileData.degree || "",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error fetching profile",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && !file.type.includes("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file for your avatar.",
        variant: "destructive",
      })
      return
    }
    setAvatarFile(file)

    // Create preview
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()]
      setSkills(updatedSkills)
      professionalForm.setValue("skills", updatedSkills.join(", "))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    const updatedSkills = skills.filter((s) => s !== skill)
    setSkills(updatedSkills)
    professionalForm.setValue("skills", updatedSkills.join(", "))
  }

  const onSubmitPersonal = async (values: z.infer<typeof personalInfoSchema>) => {
    try {
      setIsSaving(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to update your profile.",
          variant: "destructive",
        })
        return
      }

      let avatarUrl = profile?.avatar_url || null

      // Upload avatar if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop()
        const fileName = `${user.id}/avatar.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, { upsert: true })

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        // Get public URL
        const { data: urlData } = await supabase.storage.from("avatars").getPublicUrl(fileName)
        avatarUrl = urlData.publicUrl
      }

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
          username: values.username,
          bio: values.bio,
          location: values.location,
          website: values.website,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Profile updated successfully!",
        description: "Your personal information has been updated.",
      })

      // Refresh profile data
      fetchProfile()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const onSubmitProfessional = async (values: z.infer<typeof professionalInfoSchema>) => {
    try {
      setIsSaving(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to update your profile.",
          variant: "destructive",
        })
        return
      }

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          skills: skills,
          github_url: values.github_url,
          linkedin_url: values.linkedin_url,
          company: values.company,
          position: values.position,
          graduation_year: values.graduation_year,
          institution: values.institution,
          degree: values.degree,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Profile updated successfully!",
        description: "Your professional information has been updated.",
      })

      // Refresh profile data
      fetchProfile()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-gray-400">Update your personal and professional information</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={avatarPreview || ""} alt="Profile" />
                    <AvatarFallback className="text-4xl">
                      {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="sr-only">Upload avatar</span>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <h2 className="text-xl font-bold">{profile?.full_name || "Your Name"}</h2>
                <p className="text-gray-400">@{profile?.username || "username"}</p>

                <div className="mt-4 w-full">
                  <Separator className="my-4" />

                  <div className="space-y-3">
                    {profile?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{profile.email}</span>
                      </div>
                    )}

                    {profile?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{profile.location}</span>
                      </div>
                    )}

                    {profile?.company && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{profile.company}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No skills added yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="personal">Personal Information</TabsTrigger>
                  <TabsTrigger value="professional">Professional Information</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <Form {...personalForm}>
                    <form onSubmit={personalForm.handleSubmit(onSubmitPersonal)} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={personalForm.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                              </FormControl>
                              <FormDescription>This will be used in your profile URL.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={personalForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tell us about yourself..." className="min-h-[120px]" {...field} />
                            </FormControl>
                            <FormDescription>Brief description about yourself. Max 500 characters.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={personalForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving} className="gap-2">
                          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="professional" className="space-y-6">
                  <Form {...professionalForm}>
                    <form onSubmit={professionalForm.handleSubmit(onSubmitProfessional)} className="space-y-6">
                      <div>
                        <FormLabel>Skills</FormLabel>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add a skill"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addSkill()
                              }
                            }}
                          />
                          <Button type="button" onClick={addSkill} variant="outline">
                            Add
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                              {skill}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removeSkill(skill)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <FormDescription>Add your technical skills and areas of expertise.</FormDescription>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={professionalForm.control}
                          name="github_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GitHub Profile</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input className="pl-10" placeholder="https://github.com/username" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={professionalForm.control}
                          name="linkedin_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn Profile</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input className="pl-10" placeholder="https://linkedin.com/in/username" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <h3 className="text-lg font-medium">Work Experience</h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={professionalForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Current company" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={professionalForm.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position</FormLabel>
                              <FormControl>
                                <Input placeholder="Current position" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <h3 className="text-lg font-medium">Education</h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={professionalForm.control}
                          name="institution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input placeholder="University/College name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={professionalForm.control}
                          name="degree"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree</FormLabel>
                              <FormControl>
                                <Input placeholder="Degree/Certification" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={professionalForm.control}
                        name="graduation_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Graduation Year</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 20 }, (_, i) => {
                                  const year = new Date().getFullYear() - i
                                  return (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving} className="gap-2">
                          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
