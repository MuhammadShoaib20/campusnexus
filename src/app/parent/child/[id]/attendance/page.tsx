import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ChildAttendanceClient from "./ChildAttendanceClient"

export default async function ChildAttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "PARENT") redirect("/login")
  const { id } = await params

  const student = await prisma.student.findUnique({
    where: { id },
    include: { class: true },
  })
  if (!student || student.parentId !== session.user.id) notFound()

  // Fetch attendance records for this student
  const records = await prisma.attendance.findMany({
    where: { studentId: id },
    orderBy: { date: "desc" },
    take: 30,
  })

  return <ChildAttendanceClient student={student} records={records} />
}