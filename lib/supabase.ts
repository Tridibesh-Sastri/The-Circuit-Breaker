import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Also export createClient for compatibility
export { createClient }

// Types based on our database schema
export type Profile = {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  role: "member" | "admin" | "alumni"
  bio?: string | null
  department?: string | null
  year_of_study?: string | null
  points?: number
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  title: string
  description: string
  author_id: string
  co_authors: string[] | null
  year: string
  components: string[] | null
  circuit_diagram_url: string | null
  youtube_demo_url: string | null
  tags: string[] | null
  subject: string | null
  upvotes: number
  is_approved: boolean
  created_at: string
  updated_at: string
}

export type Resource = {
  id: string
  title: string
  description: string
  type: "book" | "tutorial" | "question_paper" | "datasheet"
  url: string | null
  file_url: string | null
  thumbnail_url: string | null
  author: string | null
  tags: string[] | null
  prerequisites: string[] | null
  difficulty_level: "beginner" | "intermediate" | "advanced" | null
  view_count: number
  uploader_id: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export type Event = {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  image_url: string | null
  max_participants: number | null
  organizer_id: string
  created_at: string
  updated_at: string
}

export type ForumPost = {
  id: string
  title: string
  content: string
  user_id: string
  tags: string[] | null
  view_count: number
  created_at: string
  updated_at: string
}

export type Badge = {
  id: string
  name: string
  description: string
  icon_url: string
  points: number
  created_at: string
}

export type BlogPost = {
  id: string
  title: string
  content: string
  excerpt: string | null
  author_id: string
  cover_image_url: string | null
  tags: string[] | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}
