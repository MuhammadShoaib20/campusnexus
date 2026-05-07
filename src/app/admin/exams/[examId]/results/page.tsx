import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ResultsClient from "./ResultsClient"

export default async function ResultsPage({ params }: { params: Promise<{ examId: string }> }) {
  const session = await auth()
  if (!session) redirect("/login")
  const { examId } = await params

  const examRaw = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      class: { include: { students: true } },
      examSubjects: { include: { subject: true, marks: true } }, // ✅ added subject
    },
  })
  if (!examRaw || examRaw.campusId !== session.user.campusId) notFound()

  // Convert date to string for client compatibility
  const exam = {
    ...examRaw,
    date: examRaw.date.toISOString(),
  }

  return <ResultsClient exam={exam} />
}