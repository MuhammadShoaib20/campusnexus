import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import TeacherAttendanceClient from "./TeacherAttendanceClient"

export default async function TeacherAttendancePage({ searchParams }: { searchParams: Promise<{ classId?: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") redirect("/login")
  const { classId } = await searchParams
  if (!classId) redirect("/teacher/dashboard")

  // Verify teacher is assigned to this class
  const assignment = await prisma.teacherAssignment.findUnique({
    where: { userId_classId: { userId: session.user.id, classId } },
  })
  if (!assignment) redirect("/teacher/dashboard")

  const classData = await prisma.class.findUnique({ where: { id: classId } })
  const students = await prisma.student.findMany({
    where: { classId, campusId: session.user.campusId },
    orderBy: { firstName: "asc" },
  })

  return <TeacherAttendanceClient classData={classData!} students={students} />
}