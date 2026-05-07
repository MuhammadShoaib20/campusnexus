import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ParentAnnouncementsClient from "./ParentAnnouncementsClient"

export default async function ParentAnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string }>
}) {
  const session = await auth()
  if (!session || session.user.role !== "PARENT") redirect("/login")
  const { classId } = await searchParams
  if (!classId) redirect("/parent/dashboard")

  const announcementsRaw = await prisma.assignment.findMany({
    where: { classId, campusId: session.user.campusId, type: "ANNOUNCEMENT" },
    orderBy: { createdAt: "desc" },
    include: { creator: { select: { name: true } } },
  })

  // Convert to a clean shape for the client
  const announcements = announcementsRaw.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content ?? undefined,
    creator: { name: a.creator.name },
  }))

  return <ParentAnnouncementsClient announcements={announcements} />
}