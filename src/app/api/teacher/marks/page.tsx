import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import TeacherMarksClient from "./TeacherMarksClient"

export default async function TeacherMarksPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string }>
}) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") redirect("/login")
  const { classId } = await searchParams
  if (!classId) redirect("/teacher/dashboard")

  const assignment = await prisma.teacherAssignment.findUnique({
    where: { userId_classId: { userId: session.user.id, classId } },
  })
  if (!assignment) redirect("/teacher/dashboard")

  const examsRaw = await prisma.exam.findMany({
    where: { classId, campusId: session.user.campusId },
    orderBy: { date: "desc" },
  })

  const exams = examsRaw.map((exam) => ({
    ...exam,
    date: exam.date.toISOString(),
  }))

  return <TeacherMarksClient exams={exams} />
}