"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Cpu,
  Search,
  Filter,
  Plus,
  ChevronDown,
  ThumbsUp,
  MessageSquare,
  Calendar,
  User,
  Tag,
  X,
  SlidersHorizontal,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { Project } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [activeFilters, setActiveFilters] = useState<{
    year: string | null
    subject: string | null
    tags: string[]
  }>({
    year: null,
    subject: null,
    tags: [],
  })

  // Available filter options (would be dynamically fetched in a real app)
  const years = ["2025", "2024", "2023", "2022", "2021"]
  const subjects = [
    "Digital Electronics",
    "Analog Circuits",
    "Microcontrollers",
    "IoT",
    "Embedded Systems",
    "Power Electronics",
  ]
  const allTags = [
    "Arduino",
    "Raspberry Pi",
    "IoT",
    "Robotics",
    "Home Automation",
    "Sensors",
    "Renewable Energy",
    "ESP32",
    "ESP8266",
    "Machine Learning",
  ]

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [searchQuery, sortOption, activeFilters, projects])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      // Explicitly include all projects regardless of creator role
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      if (data) {
        setProjects(data)
        setFilteredProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    let result = [...projects]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          (project.tags && project.tags.some((tag) => tag.toLowerCase().includes(query))) ||
          (project.components && project.components.some((component) => component.toLowerCase().includes(query))),
      )
    }

    // Apply year filter
    if (activeFilters.year) {
      result = result.filter((project) => project.year === activeFilters.year)
    }

    // Apply subject filter
    if (activeFilters.subject) {
      result = result.filter((project) => project.subject === activeFilters.subject)
    }

    // Apply tags filter
    if (activeFilters.tags.length > 0) {
      result = result.filter((project) => project.tags && activeFilters.tags.some((tag) => project.tags.includes(tag)))
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "most_upvotes":
        result.sort((a, b) => b.upvotes - a.upvotes)
        break
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    setFilteredProjects(result)
  }

  const clearAllFilters = () => {
    setActiveFilters({
      year: null,
      subject: null,
      tags: [],
    })
    setSearchQuery("")
    setSortOption("newest")
  }

  const removeTagFilter = (tag: string) => {
    setActiveFilters({
      ...activeFilters,
      tags: activeFilters.tags.filter((t) => t !== tag),
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-gray-400">Explore electronics projects created by the community.</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects..."
            className="pl-10 bg-gray-900/60 border-white/10 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-white/10 text-white hover:bg-gray-800">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Filter Projects</DialogTitle>
              <DialogDescription className="text-gray-400">
                Narrow down projects based on specific criteria.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Select
                  value={activeFilters.year || ""}
                  onValueChange={(value) => setActiveFilters({ ...activeFilters, year: value || null })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select
                  value={activeFilters.subject || ""}
                  onValueChange={(value) => setActiveFilters({ ...activeFilters, subject: value || null })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-gray-800 rounded-md">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={activeFilters.tags.includes(tag) ? "default" : "outline"}
                      className={
                        activeFilters.tags.includes(tag)
                          ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                          : "bg-gray-800 hover:bg-gray-700 cursor-pointer"
                      }
                      onClick={() => {
                        if (activeFilters.tags.includes(tag)) {
                          setActiveFilters({
                            ...activeFilters,
                            tags: activeFilters.tags.filter((t) => t !== tag),
                          })
                        } else {
                          setActiveFilters({
                            ...activeFilters,
                            tags: [...activeFilters.tags, tag],
                          })
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" className="border-white/10" onClick={clearAllFilters}>
                  Clear All
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-white/10 text-white hover:bg-gray-800">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Sort
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 border-white/10 text-white">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className={sortOption === "newest" ? "bg-gray-800" : ""}
              onClick={() => setSortOption("newest")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortOption === "oldest" ? "bg-gray-800" : ""}
              onClick={() => setSortOption("oldest")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortOption === "most_upvotes" ? "bg-gray-800" : ""}
              onClick={() => setSortOption("most_upvotes")}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Most Upvotes
            </DropdownMenuItem>
            <DropdownMenuItem
              className={sortOption === "alphabetical" ? "bg-gray-800" : ""}
              onClick={() => setSortOption("alphabetical")}
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
                className="h-4 w-4 mr-2"
              >
                <path d="M3 7V5h18v2" />
                <path d="M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" />
                <path d="M6 12h12" />
              </svg>
              Alphabetical
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/dashboard/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Active Filters */}
      {(activeFilters.year || activeFilters.subject || activeFilters.tags.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Active Filters:</span>
          {activeFilters.year && (
            <Badge
              variant="outline"
              className="bg-gray-800 flex items-center gap-1 hover:bg-gray-700"
              onClick={() => setActiveFilters({ ...activeFilters, year: null })}
            >
              <Calendar className="h-3 w-3" />
              Year: {activeFilters.year}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {activeFilters.subject && (
            <Badge
              variant="outline"
              className="bg-gray-800 flex items-center gap-1 hover:bg-gray-700"
              onClick={() => setActiveFilters({ ...activeFilters, subject: null })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Subject: {activeFilters.subject}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {activeFilters.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-blue-500/20 text-blue-400 border-blue-500/30 flex items-center gap-1 hover:bg-blue-500/30"
              onClick={() => removeTagFilter(tag)}
            >
              <Tag className="h-3 w-3" />
              {tag}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-gray-400 hover:text-white"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-gray-900/60 border-white/10">
              <CardContent className="p-0">
                <Skeleton className="h-40 w-full bg-gray-800" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-gray-800" />
                  <Skeleton className="h-4 w-full bg-gray-800" />
                  <Skeleton className="h-4 w-full bg-gray-800" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 bg-gray-800 rounded-full" />
                    <Skeleton className="h-6 w-16 bg-gray-800 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No projects found</h3>
          <p>Try adjusting your filters or search query.</p>
          {(activeFilters.year || activeFilters.subject || activeFilters.tags.length > 0 || searchQuery) && (
            <Button className="mt-4" variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="h-full bg-gray-900/60 border-white/10 hover:border-blue-500/50 transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative h-40 w-full bg-gray-800">
            {project.circuit_diagram_url ? (
              <img
                src={project.circuit_diagram_url || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Cpu className="h-16 w-16 text-gray-600" />
              </div>
            )}
            {!project.is_approved && (
              <Badge
                variant="outline"
                className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              >
                Pending Approval
              </Badge>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-medium mb-1 line-clamp-1">{project.title}</h3>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>

            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span>Author: {project.author_id.substring(0, 8)}...</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Year: {project.year}</span>
              </div>
            </div>

            {project.components && project.components.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Components:</p>
                <p className="text-xs text-gray-400 line-clamp-1">{project.components.join(", ")}</p>
              </div>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/30 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30 text-xs">
                    +{project.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
              <div className="flex items-center">
                <ThumbsUp className="h-3 w-3 mr-1" />
                <span>{project.upvotes} upvotes</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                <span>Comments</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
