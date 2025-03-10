"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase-client"

export async function getPapers(filters: {
  board?: string
  class?: string
  subject?: string
  year?: number
  search?: string
  limit?: number
  offset?: number
}) {
  const { board, class: classLevel, subject, year, search, limit = 10, offset = 0 } = filters

  let query = supabase
    .from("papers")
    .select(`
      *,
      board:boards(name),
      class:classes(name),
      subject:subjects(name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1)

  if (board) {
    query = query.eq("boards.name", board)
  }

  if (classLevel) {
    query = query.eq("classes.name", classLevel)
  }

  if (subject) {
    query = query.eq("subjects.name", subject)
  }

  if (year) {
    query = query.eq("year", year)
  }

  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching papers:", error)
    return []
  }

  return data
}

export async function getPaperById(id: string) {
  const { data, error } = await supabase
    .from("papers")
    .select(`
      *,
      board:boards(name),
      class:classes(name),
      subject:subjects(name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching paper:", error)
    return null
  }

  return data
}

export async function createPaper(formData: FormData) {
  const title = formData.get("title") as string
  const boardId = formData.get("board") as string
  const classId = formData.get("class") as string
  const subjectId = formData.get("subject") as string
  const year = Number.parseInt(formData.get("year") as string)
  const session = formData.get("session") as string
  const status = formData.get("status") as string
  const file = formData.get("file") as File

  // Upload file to Supabase Storage
  const fileName = `${Date.now()}_${file.name}`
  const { data: fileData, error: fileError } = await supabase.storage.from("papers").upload(fileName, file)

  if (fileError) {
    console.error("Error uploading file:", fileError)
    return { success: false, error: "Failed to upload file" }
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("papers").getPublicUrl(fileName)

  // Insert paper record
  const { data, error } = await supabase
    .from("papers")
    .insert({
      title,
      board_id: boardId,
      class_id: classId,
      subject_id: subjectId,
      year,
      session,
      status,
      file_url: publicUrl,
    })
    .select()

  if (error) {
    console.error("Error creating paper:", error)
    return { success: false, error: "Failed to create paper" }
  }

  revalidatePath("/papers")
  revalidatePath("/admin")

  return { success: true, data }
}

export async function updatePaper(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const boardId = formData.get("board") as string
  const classId = formData.get("class") as string
  const subjectId = formData.get("subject") as string
  const year = Number.parseInt(formData.get("year") as string)
  const session = formData.get("session") as string
  const status = formData.get("status") as string
  const file = formData.get("file") as File

  let fileUrl

  // If a new file is uploaded
  if (file.size > 0) {
    const fileName = `${Date.now()}_${file.name}`
    const { data: fileData, error: fileError } = await supabase.storage.from("papers").upload(fileName, file)

    if (fileError) {
      console.error("Error uploading file:", fileError)
      return { success: false, error: "Failed to upload file" }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("papers").getPublicUrl(fileName)

    fileUrl = publicUrl
  }

  // Update paper record
  const { data, error } = await supabase
    .from("papers")
    .update({
      title,
      board_id: boardId,
      class_id: classId,
      subject_id: subjectId,
      year,
      session,
      status,
      ...(fileUrl && { file_url: fileUrl }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating paper:", error)
    return { success: false, error: "Failed to update paper" }
  }

  revalidatePath(`/papers/${id}`)
  revalidatePath("/papers")
  revalidatePath("/admin")

  return { success: true, data }
}

export async function deletePaper(id: string) {
  // Get paper to find file URL
  const { data: paper, error: fetchError } = await supabase.from("papers").select("file_url").eq("id", id).single()

  if (fetchError) {
    console.error("Error fetching paper:", fetchError)
    return { success: false, error: "Failed to fetch paper" }
  }

  // Delete MCQs associated with the paper
  const { error: mcqError } = await supabase.from("mcqs").delete().eq("paper_id", id)

  if (mcqError) {
    console.error("Error deleting MCQs:", mcqError)
    return { success: false, error: "Failed to delete associated MCQs" }
  }

  // Delete paper record
  const { error } = await supabase.from("papers").delete().eq("id", id)

  if (error) {
    console.error("Error deleting paper:", error)
    return { success: false, error: "Failed to delete paper" }
  }

  // Extract filename from URL
  const fileUrl = paper.file_url
  const fileName = fileUrl.split("/").pop()

  // Delete file from storage
  if (fileName) {
    const { error: storageError } = await supabase.storage.from("papers").remove([fileName])

    if (storageError) {
      console.error("Error deleting file:", storageError)
      // Continue anyway since the paper record is deleted
    }
  }

  revalidatePath("/papers")
  revalidatePath("/admin")

  return { success: true }
}

export async function incrementDownloads(id: string) {
  const { error } = await supabase
    .from("papers")
    .update({ downloads: supabase.rpc("increment", { x: 1 }) })
    .eq("id", id)

  if (error) {
    console.error("Error incrementing downloads:", error)
    return { success: false }
  }

  revalidatePath(`/papers/${id}`)

  return { success: true }
}

