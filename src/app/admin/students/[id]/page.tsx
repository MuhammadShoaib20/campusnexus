import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import StudentForm from "@/components/StudentForm"

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect("/login")
  const { id } = await params

  const [student, classes] = await Promise.all([
    prisma.student.findUnique({ where: { id }, include: { class: true } }),
    prisma.class.findMany({ where: { campusId: session.user.campusId }, orderBy: { name: "asc" } }),
  ])

  if (!student || student.campusId !== session.user.campusId) notFound()

  // Convert dates to string for the form
  const studentData = {
    ...student,
    dateOfBirth: student.dateOfBirth?.toISOString() ?? null,
  }

  return <StudentForm student={studentData} classes={classes} />
}