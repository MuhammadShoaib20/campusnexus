import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ParentDashboardClient from "./ParentDashboardClient"

export default async function ParentDashboard() {
  const session = await auth()
  if (!session || session.user.role !== "PARENT") redirect("/login")

  const students = await prisma.student.findMany({
    where: { parentId: session.user.id },
    include: { class: true },
  })

  // Map to include classId for link purposes
  const childList = students.map((s) => ({
    ...s,
    classId: s.classId,
  }))

  return <ParentDashboardClient childList={childList} />
}