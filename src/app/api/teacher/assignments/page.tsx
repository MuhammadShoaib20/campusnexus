import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import TeacherAssignmentsClient from "./TeacherAssignmentsClient"

export default async function TeacherAssignmentsPage({
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

  const classData = await prisma.class.findUnique({ where: { id: classId } })

  const assignmentsRaw = await prisma.assignment.findMany({
    where: { classId, campusId: session.user.campusId },
    include: { creator: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  // Convert to client-friendly shape
  const assignments = assignmentsRaw.map((a) => ({
    id: a.id,
    title: a.title,
    type: a.type,
    dueDate: a.dueDate?.toISOString(),
    creator: { name: a.creator.name },
  }))

  return <TeacherAssignmentsClient classData={classData!} assignments={assignments} />
}