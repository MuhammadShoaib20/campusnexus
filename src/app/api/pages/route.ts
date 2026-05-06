import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import DOMPurify from "isomorphic-dompurify"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug, title, content } = await req.json()
    if (!slug || !title || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const cleanContent = DOMPurify.sanitize(content)

    // Use the campus from the session (or default if none)
    const campusId = session.user.campusId || "default"

    const page = await prisma.page.upsert({
      where: { slug },
      update: { title, content: cleanContent, isPublished: true },
      create: { slug, title, content: cleanContent, campusId, isPublished: true },
    })

    return NextResponse.json({ page })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}