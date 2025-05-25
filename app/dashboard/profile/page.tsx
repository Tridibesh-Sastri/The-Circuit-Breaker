"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Loader2,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Globe,
  Edit,
  Clock,
  BookOpen,
  FileText,
  Code,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data: session } = await supabase.auth.getSession()

      if (!session.session) {
        router.push("/auth")
        return
      }

      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.session.user.id).single()

      if (error) throw error

      setProfile(data)

      // Fetch user's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("author_id", session.session.user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (projectsError) throw projectsError
      setProjects(projectsData || [])

      // Fetch user's resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from("resources")
        .select("*")
        .eq("uploader_id", session.session.user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (resourcesError) throw resourcesError
      setResources(resourcesData || [])

      // Fetch recent activities (mock data for now)
      setActivities([
        {
          id: 1,
          type: "project_created",
          title: "Created a new project",
          description: "Arduino-based Smart Home System",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          type: "resource_uploaded",
          title: "Uploaded a resource",
          description: "Introduction to Digital Electronics",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          type: "forum_post",
          title: "Posted in forum",
          description: "How to debug Arduino serial communication issues?",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 4,
          type: "project_updated",
          title: "Updated a project",
          description: "Added circuit diagram to LED Matrix project",
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project_created":
      case "project_updated":
        return <Code className="h-4 w-4 text-blue-400" />
      case "resource_uploaded":
        return <BookOpen className="h-4 w-4 text-emerald-400" />
      case "forum_post":
        return <FileText className="h-4 w-4 text-amber-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Button onClick={() => router.push("/dashboard/profile/edit")} className="flex items-center gap-2">
          <Edit className="h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-900/60 border-white/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || ""} />
                  <AvatarFallback className="bg-gray-700 text-gray-200 text-2xl">
                    {profile?.username?.charAt(0).toUpperCase() || profile?.full_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{profile?.full_name || "Anonymous User"}</h2>
                <p className="text-gray-400">@{profile?.username || "username"}</p>

                <Badge
                  className={
                    profile?.role === "admin"
                      ? "bg-red-500/20 text-red-500 mt-2"
                      : profile?.role === "alumni"
                        ? "bg-purple-500/20 text-purple-500 mt-2"
                        : "bg-emerald-500/20 text-emerald-500 mt-2"
                  }
                >
                  {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1) || "Member"}
                </Badge>

                {profile?.bio && <p className="mt-4 text-gray-300">{profile.bio}</p>}

                <div className="w-full border-t border-gray-800 my-6"></div>

                <div className="w-full space-y-3">
                  {profile?.department && (
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <span>{profile.department}</span>
                      {profile?.year_of_study && <span className="text-gray-400">• Year {profile.year_of_study}</span>}
                    </div>
                  )}

                  {profile?.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {(profile?.company || profile?.position) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span>
                        {profile?.position && profile.position}
                        {profile?.company && profile?.position && " at "}
                        {profile?.company && profile.company}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>Email hidden for privacy</span>
                  </div>
                </div>

                <div className="w-full border-t border-gray-800 my-6"></div>

                <div className="flex gap-3 mt-2">
                  {profile?.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}

                  {profile?.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}

                  {profile?.website_url && (
                    <a
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-400">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No skills added yet. Edit your profile to add skills.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6">
              <Card className="bg-gray-900/60 border-white/10">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-4 pb-4 border-b border-gray-800 last:border-0">
                          <div className="mt-1">{getActivityIcon(activity.type)}</div>
                          <div>
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-gray-400 text-sm">{activity.description}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Clock className="h-12 w-12 mx-auto mb-3 text-gray-500 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <Card className="bg-gray-900/60 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Projects</CardTitle>
                    <CardDescription>Projects you've created or contributed to</CardDescription>
                  </div>
                  <Button onClick={() => router.push("/dashboard/projects/create")} size="sm">
                    New Project
                  </Button>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="flex gap-4 pb-4 border-b border-gray-800 last:border-0">
                          <div className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center">
                            <Code className="h-6 w-6 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{project.title}</h4>
                            <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.tags &&
                                project.tags.slice(0, 3).map((tag: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-emerald-500/10 text-emerald-400 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              {project.tags && project.tags.length > 3 && (
                                <Badge variant="outline" className="bg-gray-800 text-gray-400 text-xs">
                                  +{project.tags.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Code className="h-12 w-12 mx-auto mb-3 text-gray-500 opacity-50" />
                      <p>You haven't created any projects yet</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push("/dashboard/projects/create")}
                      >
                        Create Your First Project
                      </Button>
                    </div>
                  )}

                  {projects.length > 0 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" onClick={() => router.push("/dashboard/projects")}>
                        View All Projects
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <Card className="bg-gray-900/60 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Resources</CardTitle>
                    <CardDescription>Educational resources you've shared</CardDescription>
                  </div>
                  <Button onClick={() => router.push("/dashboard/resources/upload")} size="sm">
                    Upload Resource
                  </Button>
                </CardHeader>
                <CardContent>
                  {resources.length > 0 ? (
                    <div className="space-y-4">
                      {resources.map((resource) => (
                        <div key={resource.id} className="flex gap-4 pb-4 border-b border-gray-800 last:border-0">
                          <div className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-gray-400 text-sm line-clamp-2">{resource.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 text-xs">
                                {resource.type.replace("_", " ")}
                              </Badge>
                              {resource.tags &&
                                resource.tags.slice(0, 2).map((tag: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-emerald-500/10 text-emerald-400 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              {resource.tags && resource.tags.length > 2 && (
                                <Badge variant="outline" className="bg-gray-800 text-gray-400 text-xs">
                                  +{resource.tags.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/dashboard/library/${resource.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-500 opacity-50" />
                      <p>You haven't uploaded any resources yet</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push("/dashboard/resources/upload")}
                      >
                        Upload Your First Resource
                      </Button>
                    </div>
                  )}

                  {resources.length > 0 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" onClick={() => router.push("/dashboard/library")}>
                        View All Resources
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
