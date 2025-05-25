import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Youtube, Cpu, Download, ExternalLink, ThumbsUp, Share2 } from "lucide-react"
import Link from "next/link"

export default async function ResourceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()

  // Fetch resource
  const { data: resource, error } = await supabase.from("resources").select("*").eq("id", params.id).single()

  if (error || !resource) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("resources")
    .update({ view_count: resource.view_count + 1 })
    .eq("id", params.id)

  // Fetch uploader profile
  const { data: uploader } = await supabase
    .from("profiles")
    .select("username, full_name, avatar_url")
    .eq("id", resource.uploader_id)
    .single()

  const getIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-6 w-6 text-emerald-500" />
      case "tutorial":
        return <Youtube className="h-6 w-6 text-red-500" />
      case "question_paper":
        return <FileText className="h-6 w-6 text-blue-500" />
      case "datasheet":
        return <Cpu className="h-6 w-6 text-purple-500" />
      default:
        return <BookOpen className="h-6 w-6 text-emerald-500" />
    }
  }

  const getDifficultyColor = (level: string | null) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/library" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back to Library
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-gray-900/60 border-white/10 overflow-hidden">
            <div className="h-48 bg-gray-800 flex items-center justify-center">
              {resource.thumbnail_url ? (
                <img
                  src={resource.thumbnail_url || "/placeholder.svg"}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 text-gray-600">{getIcon(resource.type)}</div>
              )}
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(resource.type)}
                  <span className="text-sm text-gray-400 capitalize">{resource.type.replace("_", " ")}</span>
                </div>
                <Badge variant="outline" className={getDifficultyColor(resource.difficulty_level)}>
                  {resource.difficulty_level || "All Levels"}
                </Badge>
              </div>

              <div className="space-y-3">
                {resource.file_url && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}

                {resource.url && (
                  <Button variant="outline" className="w-full border-white/10 hover:bg-gray-800">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Resource
                  </Button>
                )}
              </div>

              <div className="pt-4 border-t border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Uploaded by:</span>
                  <span>{uploader?.full_name || uploader?.username || "Unknown"}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Upload Date:</span>
                  <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Views:</span>
                  <span>{resource.view_count}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {resource.prerequisites && resource.prerequisites.length > 0 && (
            <Card className="bg-gray-900/60 border-white/10">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Prerequisites</h3>
                <ul className="space-y-2">
                  {resource.prerequisites.map((prerequisite) => (
                    <li key={prerequisite} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {prerequisite}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{resource.title}</h1>
            <p className="text-gray-400 mb-4">{resource.author && `By ${resource.author}`}</p>

            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {resource.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Card className="bg-gray-900/60 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-4">Description</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-line">{resource.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Embedded content for tutorials */}
          {resource.type === "tutorial" && resource.url && resource.url.includes("youtube") && (
            <Card className="bg-gray-900/60 border-white/10 overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={resource.url.replace("watch?v=", "embed/")}
                  title={resource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </Card>
          )}

          {/* Related Resources (placeholder) */}
          <Card className="bg-gray-900/60 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-4">Related Resources</h2>
              <p className="text-gray-400 text-center py-4">Related resources will appear here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
