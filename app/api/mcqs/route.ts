import { type NextRequest, NextResponse } from "next/server"
import { getMcqsBySetId } from "@/app/actions/mcq-actions"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const setId = searchParams.get("setId")

  if (!setId) {
    return NextResponse.json({ error: "Missing setId parameter" }, { status: 400 })
  }

  try {
    const mcqs = await getMcqsBySetId(setId)
    return NextResponse.json(mcqs)
  } catch (error) {
    console.error("Error fetching MCQs:", error)
    return NextResponse.json({ error: "Failed to fetch MCQs" }, { status: 500 })
  }
}

