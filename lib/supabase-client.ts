import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

// Types for our database schema
export type Board = {
  id: string
  name: string
  created_at: string
}

export type Class = {
  id: string
  name: string
  created_at: string
}

export type Subject = {
  id: string
  name: string
  created_at: string
}

export type McqSet = {
  id: string
  title: string
  board: string
  subject: string
  year: number
  mcq_count: number
  practice_count: number
  created_at: string
  updated_at: string
}

export type Mcq = {
  id: string
  mcq_set_id: string
  question: string
  options: string[]
  correct_answer: number
  created_at: string
  updated_at: string
}

