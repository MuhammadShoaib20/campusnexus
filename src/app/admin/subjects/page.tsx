import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import SubjectsClient from "./SubjectsClient"

export default async function SubjectsPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const subjects = await prisma.subject.findMany({
    where: { campusId: session.user.campusId },
    orderBy: { name: "asc" },
  })
  return <SubjectsClient subjects={subjects} />
}