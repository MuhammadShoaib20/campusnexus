import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import MarksClient from "./MarksClient"

export default async function MarksEntryPage({ params }: { params: Promise<{ examId: string }> }) {
  const session = await auth()
  if (!session) redirect("/login")

  // Allow ADMIN, SUPER_ADMIN, and TEACHER (with assignment check)
  if (
    session.user.role !== "SUPER_ADMIN" &&
    session.user.role !== "ADMIN" &&
    session.user.role !== "TEACHER"
  ) {
    redirect("/login")
  }

  const { examId } = await params

  if (session.user.role === "TEACHER") {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      select: { classId: true },
    })
    if (!exam) notFound()

    const assignment = await prisma.teacherAssignment.findUnique({
      where: {
        userId_classId: {
          userId: session.user.id,
          classId: exam.classId,
        },
      },
    })
    if (!assignment) redirect("/teacher/dashboard")
  }

  const examRaw = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      examSubjects: { include: { subject: true, marks: true } },
      class: { include: { students: true } },
    },
  })
  if (!examRaw || examRaw.campusId !== session.user.campusId) notFound()

  const exam = {
    ...examRaw,
    date: examRaw.date.toISOString(),
  }

  return <MarksClient exam={exam} />
}