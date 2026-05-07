import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import MarksClient from "./MarksClient"

export default async function MarksEntryPage({ params }: { params: Promise<{ examId: string }> }) {
  const session = await auth()
  if (!session) redirect("/login")
  const { examId } = await params

  const examRaw = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      examSubjects: { include: { subject: true, marks: true } },
      class: { include: { students: true } },
    },
  })
  if (!examRaw || examRaw.campusId !== session.user.campusId) notFound()

  // Convert Date to string for client compatibility
  const exam = {
    ...examRaw,
    date: examRaw.date.toISOString(),
  }

  return <MarksClient exam={exam} />
}