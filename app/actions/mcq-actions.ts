"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase-client"

// Types for our database schema
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

// Get MCQ sets with filtering options
export async function getMcqSets(filters: {
  board?: string
  subject?: string
  year?: number
  search?: string
  limit?: number
  offset?: number
}) {
  const { board, subject, year, search, limit = 10, offset = 0 } = filters

  let query = supabase
    .from("mcq_sets")
    .select(`
      *,
      mcq_count:mcqs(count)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1)

  if (board) {
    query = query.eq("board", board)
  }

  if (subject) {
    query = query.eq("subject", subject)
  }

  if (year) {
    query = query.eq("year", year)
  }

  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching MCQ sets:", error)
    return []
  }

  // Transform mcq_count from object to number
  const transformedData = data?.map((set) => ({
    ...set,
    mcq_count: set.mcq_count?.count || 0,
  }))

  return transformedData || []
}

// Get a single MCQ set by ID
export async function getMcqSetById(id: string) {
  const { data, error } = await supabase
    .from("mcq_sets")
    .select(`
      *,
      mcqs(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching MCQ set:", error)
    return null
  }

  // Transform mcq_count if it exists
  if (data && data.mcq_count && typeof data.mcq_count === "object") {
    data.mcq_count = data.mcq_count.count || 0
  }

  return data
}

// Update the createMcqSet function to include class
export async function createMcqSet(formData: FormData) {
  const title = formData.get("title") as string
  const board = formData.get("board") as string
  const classLevel = formData.get("class") as string
  const subject = formData.get("subject") as string
  const year = Number.parseInt(formData.get("year") as string)

  const { data, error } = await supabase
    .from("mcq_sets")
    .insert({
      title,
      board,
      class: classLevel,
      subject,
      year,
    })
    .select()

  if (error) {
    console.error("Error creating MCQ set:", error)
    return { success: false, error: "Failed to create MCQ set" }
  }

  revalidatePath("/admin")
  revalidatePath("/mcq-practice")

  return { success: true, data }
}

// Update the updateMcqSet function to include class
export async function updateMcqSet(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const board = formData.get("board") as string
  const classLevel = formData.get("class") as string
  const subject = formData.get("subject") as string
  const year = Number.parseInt(formData.get("year") as string)

  const { data, error } = await supabase
    .from("mcq_sets")
    .update({
      title,
      board,
      class: classLevel,
      subject,
      year,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating MCQ set:", error)
    return { success: false, error: "Failed to update MCQ set" }
  }

  revalidatePath(`/admin/mcq-sets/${id}`)
  revalidatePath("/admin")
  revalidatePath("/mcq-practice")

  return { success: true, data }
}

// Delete an MCQ set
export async function deleteMcqSet(id: string) {
  // Delete MCQs associated with the set
  const { error: mcqError } = await supabase.from("mcqs").delete().eq("mcq_set_id", id)

  if (mcqError) {
    console.error("Error deleting MCQs:", mcqError)
    return { success: false, error: "Failed to delete associated MCQs" }
  }

  // Delete the MCQ set
  const { error } = await supabase.from("mcq_sets").delete().eq("id", id)

  if (error) {
    console.error("Error deleting MCQ set:", error)
    return { success: false, error: "Failed to delete MCQ set" }
  }

  revalidatePath("/admin")
  revalidatePath("/mcq-practice")

  return { success: true }
}

// Get MCQs by set ID
export async function getMcqsBySetId(setId: string) {
  const { data, error } = await supabase.from("mcqs").select("*").eq("mcq_set_id", setId).order("id")

  if (error) {
    console.error("Error fetching MCQs:", error)
    return []
  }

  return data
}

// Create a new MCQ
export async function createMcq(formData: FormData) {
  const mcqSetId = formData.get("mcq_set_id") as string
  const question = formData.get("question") as string
  const options = JSON.parse(formData.get("options") as string)
  const correctAnswer = Number.parseInt(formData.get("correct_answer") as string)

  const { data, error } = await supabase
    .from("mcqs")
    .insert({
      mcq_set_id: mcqSetId,
      question,
      options,
      correct_answer: correctAnswer,
    })
    .select()

  if (error) {
    console.error("Error creating MCQ:", error)
    return { success: false, error: "Failed to create MCQ" }
  }

  revalidatePath(`/admin/mcq-sets/${mcqSetId}`)

  return { success: true, data }
}

// Update an existing MCQ
export async function updateMcq(id: string, formData: FormData) {
  const question = formData.get("question") as string
  const options = JSON.parse(formData.get("options") as string)
  const correctAnswer = Number.parseInt(formData.get("correct_answer") as string)

  const { data, error } = await supabase
    .from("mcqs")
    .update({
      question,
      options,
      correct_answer: correctAnswer,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating MCQ:", error)
    return { success: false, error: "Failed to update MCQ" }
  }

  const mcqSetId = data[0].mcq_set_id
  revalidatePath(`/admin/mcq-sets/${mcqSetId}`)

  return { success: true, data }
}

// Delete an MCQ
export async function deleteMcq(id: string) {
  // Get MCQ to find set ID
  const { data: mcq, error: fetchError } = await supabase.from("mcqs").select("mcq_set_id").eq("id", id).single()

  if (fetchError) {
    console.error("Error fetching MCQ:", fetchError)
    return { success: false, error: "Failed to fetch MCQ" }
  }

  const mcqSetId = mcq.mcq_set_id

  // Delete MCQ
  const { error } = await supabase.from("mcqs").delete().eq("id", id)

  if (error) {
    console.error("Error deleting MCQ:", error)
    return { success: false, error: "Failed to delete MCQ" }
  }

  revalidatePath(`/admin/mcq-sets/${mcqSetId}`)

  return { success: true }
}

// Increment practice count for an MCQ set
export async function incrementPracticeCount(id: string) {
  const { error } = await supabase
    .from("mcq_sets")
    .update({ practice_count: supabase.rpc("increment", { x: 1 }) })
    .eq("id", id)

  if (error) {
    console.error("Error incrementing practice count:", error)
    return { success: false }
  }

  return { success: true }
}

