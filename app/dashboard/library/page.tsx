import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileText, Youtube, Cpu, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Resource } from "@/lib/supabase"

export default async function LibraryPage() {
  const supabase = createServerSupabaseClient()

  // Fetch resources
  const { data: resources } = await supabase.from("resources").select("*").order("created_at", { ascending: false })

  // Group resources by type
  const books = resources?.filter((resource) => resource.type === "book") || []
  const tutorials = resources?.filter((resource) => resource.type === "tutorial") || []
  const questionPapers = resources?.filter((resource) => resource.type === "question_paper") || []
  const datasheets = resources?.filter((resource) => resource.type === "datasheet") || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Library</h1>
        <p className="text-gray-400">Access educational resources for electronics and electrical engineering.</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search resources..." className="pl-10 bg-gray-900/60 border-white/10 text-white" />
        </div>
        <Button variant="outline" className="border-white/10 text-white hover:bg-gray-800">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button className="bg-emerald-500 text-black hover:bg-emerald-600">Upload Resource</Button>
      </div>

      {/* Tabs for resource types */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-900/60 border border-white/10 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-gray-800">
            All
          </TabsTrigger>
          <TabsTrigger value="books" className="data-[state=active]:bg-gray-800">
            Books
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="data-[state=active]:bg-gray-800">
            Tutorials
          </TabsTrigger>
          <TabsTrigger value="papers" className="data-[state=active]:bg-gray-800">
            Question Papers
          </TabsTrigger>
          <TabsTrigger value="datasheets" className="data-[state=active]:bg-gray-800">
            Datasheets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources && resources.length > 0 ? (
              resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No resources found</h3>
                <p>Be the first to upload a resource to the library.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="books" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.length > 0 ? (
              books.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No books found</h3>
                <p>Be the first to upload a book to the library.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.length > 0 ? (
              tutorials.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-400">
                <Youtube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No tutorials found</h3>
                <p>Be the first to upload a tutorial to the library.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="papers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionPapers.length > 0 ? (
              questionPapers.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No question papers found</h3>
                <p>Be the first to upload a question paper to the library.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="datasheets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasheets.length > 0 ? (
              datasheets.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-400">
                <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No datasheets found</h3>
                <p>Be the first to upload a datasheet to the library.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-5 w-5 text-emerald-500" />
      case "tutorial":
        return <Youtube className="h-5 w-5 text-red-500" />
      case "question_paper":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "datasheet":
        return <Cpu className="h-5 w-5 text-purple-500" />
      default:
        return <BookOpen className="h-5 w-5 text-emerald-500" />
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
    <Link href={`/dashboard/library/${resource.id}`}>
      <Card className="h-full bg-gray-900/60 border-white/10 hover:border-emerald-500/50 transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative h-40 w-full bg-gray-800">
            {resource.thumbnail_url ? (
              <img
                src={resource.thumbnail_url || "/placeholder.svg"}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="h-16 w-16 text-gray-600">{getIcon(resource.type)}</div>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className={getDifficultyColor(resource.difficulty_level)}>
                {resource.difficulty_level || "All Levels"}
              </Badge>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {getIcon(resource.type)}
              <span className="text-xs text-gray-400 capitalize">{resource.type.replace("_", " ")}</span>
            </div>

            <h3 className="font-medium mb-1 line-clamp-1">{resource.title}</h3>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{resource.description}</p>

            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {resource.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                {resource.tags.length > 3 && (
                  <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30 text-xs">
                    +{resource.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
              <span>By {resource.author || "Unknown"}</span>
              <span>{resource.view_count} views</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
