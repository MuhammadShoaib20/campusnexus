import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import TeacherDashboardClient from "./TeacherDashboardClient"

export default async function TeacherDashboard() {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") redirect("/login")

  const assignments = await prisma.teacherAssignment.findMany({
    where: { userId: session.user.id },
    include: { class: true },
  })

  return <TeacherDashboardClient classes={assignments.map(a => a.class)} />
}