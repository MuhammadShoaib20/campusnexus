// src/app/api/assignments/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const classId = req.nextUrl.searchParams.get("classId")
  const type = req.nextUrl.searchParams.get("type")

  const where: Record<string, unknown> = { campusId }
  if (classId) where.classId = classId
  if (type) where.type = type

  const assignments = await prisma.assignment.findMany({
    where,
    include: { class: true, creator: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(assignments)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { classId, title, content, type, dueDate } = await req.json()
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })

  try {
    const assignment = await prisma.assignment.create({
      data: {
        campusId: session.user.campusId,
        classId: classId || null,
        createdBy: session.user.id,
        title,
        content,
        type: type || "ANNOUNCEMENT",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })
    return NextResponse.json({ assignment }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}