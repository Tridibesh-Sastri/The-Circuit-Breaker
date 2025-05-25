import { notFound } from "next/navigation"
import Image from "next/image"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const dynamic = "force-dynamic"

async function getProject(id: string) {
  const supabase = createServerComponentClient({ cookies })

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      profiles:author_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("id", id)
    .single()

  if (error || !project) {
    console.error("Error fetching project:", error)
    return null
  }

  return project
}

async function getComments(projectId: string) {
  const supabase = createServerComponentClient({ cookies })

  const { data: comments, error } = await supabase
    .from("project_comments")
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching comments:", error)
    return []
  }

  return comments
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  const comments = await getComments(params.id)
  const createdAt = new Date(project.created_at)

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.profiles.avatar_url || undefined} alt={project.profiles.full_name} />
              <AvatarFallback>
                {project.profiles.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              By {project.profiles.full_name} • {format(createdAt, "MMMM d, yyyy")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{project.year}</Badge>
          {project.subject && <Badge variant="secondary">{project.subject}</Badge>}
          {project.is_approved ? (
            <Badge variant="default" className="bg-green-600">
              Approved
            </Badge>
          ) : (
            <Badge variant="outline">Pending Approval</Badge>
          )}
        </div>
      </div>

      <div className="mb-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="whitespace-pre-line">{project.description}</p>

                {project.circuit_diagram_url && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium">Circuit Diagram</h3>
                    <div className="mt-2 overflow-hidden rounded-md border">
                      <Image
                        src={project.circuit_diagram_url || "/placeholder.svg"}
                        alt="Circuit Diagram"
                        width={800}
                        height={600}
                        className="w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {project.youtube_demo_url && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium">Video Demonstration</h3>
                    <div className="mt-2">
                      <a
                        href={project.youtube_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Watch on YouTube <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Comments ({comments.length})</h2>

            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="mt-1 h-8 w-8">
                          <AvatarImage
                            src={comment.profiles.avatar_url || undefined}
                            alt={comment.profiles.full_name}
                          />
                          <AvatarFallback>
                            {comment.profiles.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{comment.profiles.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(comment.created_at), "MMM d, yyyy h:mm a")}
                            </p>
                          </div>
                          <p className="mt-1 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                </CardContent>
              </Card>
            )}

            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="mb-2 text-lg font-medium">Add a Comment</h3>
                <form className="space-y-4">
                  <textarea
                    className="w-full rounded-md border bg-background px-3 py-2"
                    rows={3}
                    placeholder="Write your comment here..."
                  />
                  <Button type="submit">Post Comment</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Project Details</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Components Used</h4>
                  <ul className="mt-1 list-inside list-disc space-y-1">
                    {project.components &&
                      project.components.map((component, index) => (
                        <li key={index} className="text-sm">
                          {component}
                        </li>
                      ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.tags &&
                      project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Statistics</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">{project.upvotes}</p>
                      <p className="text-xs text-muted-foreground">Upvotes</p>
                    </div>
                    <div>
                      <p className="font-medium">{comments.length}</p>
                      <p className="text-xs text-muted-foreground">Comments</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button className="w-full">Upvote Project</Button>
                <Button variant="outline" className="w-full">
                  Share Project
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Similar Projects</h3>
              <p className="text-center text-sm text-muted-foreground">Similar projects will appear here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
