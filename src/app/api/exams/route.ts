import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const campusId = session.user.campusId
  const classId = req.nextUrl.searchParams.get("classId")

  const where: Record<string, unknown> = { campusId }
  if (classId) where.classId = classId

  const exams = await prisma.exam.findMany({
    where,
    include: { examSubjects: { include: { subject: true } }, class: true },
    orderBy: { date: "desc" },
  })
  return NextResponse.json(exams)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { classId, name, date, type, subjects } = await req.json()
  if (!classId || !name || !date || !subjects || !Array.isArray(subjects)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  try {
    const exam = await prisma.exam.create({
      data: {
        classId,
        name,
        date: new Date(date),
        type: type || "Midterm",
        campusId: session.user.campusId,
        examSubjects: {
          create: subjects.map((s: { subjectId: string; maxMarks: number }) => ({
            subjectId: s.subjectId,
            maxMarks: s.maxMarks,
          })),
        },
      },
      include: { examSubjects: { include: { subject: true } }, class: true },
    })
    return NextResponse.json({ exam }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 })
  }
}