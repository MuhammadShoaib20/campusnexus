import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const examId = req.nextUrl.searchParams.get("examId")
  if (!examId) return NextResponse.json({ error: "examId required" }, { status: 400 })

  const examSubjects = await prisma.examSubject.findMany({
    where: { examId },
    include: {
      subject: true,
      marks: { include: { student: true } },
    },
  })

  // Restructure into a more usable format
  const result = examSubjects.map(es => ({
    subject: es.subject,
    maxMarks: es.maxMarks,
    marks: es.marks.map(m => ({
      studentId: m.studentId,
      studentName: `${m.student.firstName} ${m.student.lastName}`,
      obtained: m.obtainedMarks,
    })),
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { marks } = await req.json()  // [{ examSubjectId, studentId, obtainedMarks }]
  if (!marks || !Array.isArray(marks)) return NextResponse.json({ error: "Invalid data" }, { status: 400 })

  try {
    for (const m of marks) {
      await prisma.mark.upsert({
        where: {
          studentId_examSubjectId: {
            studentId: m.studentId,
            examSubjectId: m.examSubjectId,
          },
        },
        update: { obtainedMarks: m.obtainedMarks },
        create: {
          studentId: m.studentId,
          examSubjectId: m.examSubjectId,
          obtainedMarks: m.obtainedMarks,
        },
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to save marks" }, { status: 500 })
  }
}