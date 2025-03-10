import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  // Clear the authentication cookie
  cookies().delete("admin_authenticated")

  return NextResponse.json({ success: true })
}

