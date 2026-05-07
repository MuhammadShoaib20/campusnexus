import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ChildResultsClient from "./ChildResultsClient"

export default async function ChildResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "PARENT") redirect("/login")
  const { id } = await params

  const student = await prisma.student.findUnique({
    where: { id },
    select: { id: true, firstName: true, lastName: true, parentId: true },
  })
  if (!student || student.parentId !== session.user.id) notFound()

  const examsRaw = await prisma.exam.findMany({
    where: { campusId: session.user.campusId, class: { students: { some: { id } } } },
    include: {
      examSubjects: {
        include: {
          subject: true,
          marks: { where: { studentId: id }, select: { obtainedMarks: true } },
        },
      },
    },
    orderBy: { date: "desc" },
  })

  // Convert Date to string for client compatibility
  const exams = examsRaw.map(exam => ({
    ...exam,
    date: exam.date.toISOString(),
  }))

  return <ChildResultsClient student={student} exams={exams} />
}