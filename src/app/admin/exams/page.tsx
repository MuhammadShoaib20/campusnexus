import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ExamsClient from "./ExamsClient"
import AdminHeader from "@/components/AdminHeader"

export default async function ExamsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const [classes, subjects, examsRaw] = await Promise.all([
    prisma.class.findMany({ where: { campusId: session.user.campusId }, orderBy: { name: "asc" } }),
    prisma.subject.findMany({ where: { campusId: session.user.campusId }, orderBy: { name: "asc" } }),
    prisma.exam.findMany({
      where: { campusId: session.user.campusId },
      include: { class: true, examSubjects: { include: { subject: true } } },
      orderBy: { date: "desc" },
    }),
  ])

  // Convert Date to string for the client
  const exams = examsRaw.map(exam => ({
    ...exam,
    date: exam.date.toISOString(),
  }))

  return (
    <div>
      <AdminHeader />
      <ExamsClient classes={classes} subjects={subjects} exams={exams} />
    </div>
  )
}