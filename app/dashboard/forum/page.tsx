"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, Eye, Clock } from "lucide-react"
import Link from "next/link"
import { ForumHeader } from "@/components/forum/forum-header"
import { ForumCategories } from "@/components/forum/forum-categories"

// Mock categories and tags (replace with real data later)
const MOCK_CATEGORIES = [
  { id: "1", name: "General Discussion", count: 124 },
  { id: "2", name: "Projects", count: 87 },
  { id: "3", name: "Tutorials", count: 56 },
  { id: "4", name: "Troubleshooting", count: 93 },
  { id: "5", name: "Components", count: 42 },
  { id: "6", name: "Tools & Equipment", count: 31 },
  { id: "7", name: "Events", count: 18 },
]

const MOCK_TAGS = [
  { id: "1", name: "arduino", count: 45 },
  { id: "2", name: "raspberry-pi", count: 38 },
  { id: "3", name: "microcontrollers", count: 32 },
  { id: "4", name: "pcb", count: 27 },
  { id: "5", name: "sensors", count: 24 },
  { id: "6", name: "programming", count: 21 },
  { id: "7", name: "power", count: 19 },
  { id: "8", name: "led", count: 17 },
  { id: "9", name: "motors", count: 15 },
]

// Mock forum posts data for development
const MOCK_POSTS = [
  {
    id: "1",
    title: "How to get started with Arduino?",
    content: "I'm new to electronics and want to learn Arduino. What's the best way to get started?",
    author: {
      id: "user1",
      name: "John Doe",
      avatarUrl: "/placeholder.svg?height=32&width=32",
      role: "member",
    },
    tags: ["arduino", "beginners", "microcontrollers"],
    viewCount: 120,
    likeCount: 15,
    commentCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
  },
  {
    id: "2",
    title: "Best oscilloscope for students?",
    content: "I'm looking for an affordable oscilloscope for my electronics projects. Any recommendations?",
    author: {
      id: "user2",
      name: "Jane Smith",
      avatarUrl: "/placeholder.svg?height=32&width=32",
      role: "admin",
    },
    tags: ["tools", "oscilloscope", "recommendations"],
    viewCount: 85,
    likeCount: 10,
    commentCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
  },
  {
    id: "3",
    title: "PCB design software comparison",
    content: "I've been using Eagle for PCB design, but I'm curious about other options like KiCad and Altium.",
    author: {
      id: "user3",
      name: "Mike Johnson",
      avatarUrl: "/placeholder.svg?height=32&width=32",
      role: "mentor",
    },
    tags: ["pcb", "design", "software"],
    viewCount: 210,
    likeCount: 25,
    commentCount: 18,
    createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
  },
  {
    id: "4",
    title: "Troubleshooting power supply issues",
    content: "My custom power supply is outputting inconsistent voltage. How can I debug this?",
    author: {
      id: "user4",
      name: "Sarah Williams",
      avatarUrl: "/placeholder.svg?height=32&width=32",
      role: "moderator",
    },
    tags: ["power", "troubleshooting", "voltage"],
    viewCount: 95,
    likeCount: 8,
    commentCount: 14,
    createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
  },
  {
    id: "5",
    title: "Raspberry Pi vs Arduino for home automation",
    content: "I'm planning a home automation project. Should I use Raspberry Pi or Arduino?",
    author: {
      id: "user5",
      name: "Alex Chen",
      avatarUrl: "/placeholder.svg?height=32&width=32",
      role: "member",
    },
    tags: ["raspberry-pi", "arduino", "home-automation"],
    viewCount: 180,
    likeCount: 22,
    commentCount: 25,
    createdAt: new Date(Date.now() - 86400000 * 4), // 4 days ago
  },
]

export default function ForumPage() {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Temporarily disabled real data fetching due to schema issues
    // Instead using mock data
    // fetchPosts()
    setLoading(false)
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)

      // First, fetch the forum posts
      const { data: postsData, error: postsError } = await supabase
        .from("forum_posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (postsError) throw postsError

      if (postsData && postsData.length > 0) {
        // Get all unique user IDs from the posts
        const userIds = [...new Set(postsData.map((post) => post.user_id))]

        // Fetch profiles for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", userIds)

        if (profilesError) throw profilesError

        // Create a map of user profiles for easy lookup
        const profilesMap = {}
        if (profilesData) {
          profilesData.forEach((profile) => {
            profilesMap[profile.id] = profile
          })
        }

        // Combine posts with their author profiles
        const formattedPosts = postsData.map((post) => {
          const authorProfile = profilesMap[post.user_id] || {}

          return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: {
              id: post.user_id,
              name: authorProfile.full_name || "Unknown User",
              avatarUrl: authorProfile.avatar_url || "/placeholder.svg?height=32&width=32",
              role: authorProfile.role || "member",
            },
            tags: post.tags || [],
            viewCount: post.view_count || 0,
            likeCount: post.like_count || 0,
            commentCount: post.comment_count || 0,
            createdAt: new Date(post.created_at),
          }
        })

        setPosts(formattedPosts)
      }
    } catch (error) {
      console.error("Error fetching forum posts:", error)
      // Fall back to mock data if there's an error
      setPosts(MOCK_POSTS)
    } finally {
      setLoading(false)
    }
  }

  // Define the Post component inline to fix the import error
  function ForumPost({ post }) {
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }

    // Function to get role badge color
    const getRoleBadgeColor = (role) => {
      switch (role?.toLowerCase()) {
        case "admin":
          return "bg-red-500 hover:bg-red-600"
        case "moderator":
          return "bg-blue-500 hover:bg-blue-600"
        case "mentor":
          return "bg-green-500 hover:bg-green-600"
        case "member":
          return "bg-purple-500 hover:bg-purple-600"
        default:
          return "bg-gray-500 hover:bg-gray-600"
      }
    }

    return (
      <Card className="bg-gray-900/60 border-white/10 hover:border-purple-500/50 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatarUrl || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Link href={`/dashboard/forum/post/${post.id}`} className="hover:underline">
                <h3 className="text-lg font-medium mb-1">{post.title}</h3>
              </Link>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{post.content}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t border-gray-800 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-1">
                <AvatarImage src={post.author.avatarUrl || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{post.author.name}</span>
            </div>
            {post.author.role && (
              <Badge className={`ml-2 text-xs ${getRoleBadgeColor(post.author.role)}`}>{post.author.role}</Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{post.viewCount}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{post.likeCount}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.commentCount}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <ForumHeader />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gray-900/60 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4 bg-gray-800" />
                        <Skeleton className="h-4 w-full bg-gray-800" />
                        <Skeleton className="h-4 w-full bg-gray-800" />
                        <div className="flex gap-2">
                          <Skeleton className="h-4 w-16 bg-gray-800" />
                          <Skeleton className="h-4 w-16 bg-gray-800" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-3 border-t border-gray-800">
                    <div className="flex justify-between w-full">
                      <Skeleton className="h-4 w-24 bg-gray-800" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-12 bg-gray-800" />
                        <Skeleton className="h-4 w-12 bg-gray-800" />
                        <Skeleton className="h-4 w-12 bg-gray-800" />
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <ForumPost key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="bg-gray-900/60 border-white/10">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-medium mb-2">No Posts Yet</h3>
                <p className="text-gray-400 mb-4">Be the first to start a discussion!</p>
                <Button className="bg-purple-600 hover:bg-purple-700">Create Post</Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <ForumCategories categories={MOCK_CATEGORIES} popularTags={MOCK_TAGS} />
        </div>
      </div>
    </div>
  )
}
