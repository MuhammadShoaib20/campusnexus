import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import SettingsForm from "./SettingsForm"

export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) redirect("/login")

  const campus = await prisma.campus.findUnique({
    where: { slug: session.user.campusId },
  })

  if (!campus) return <div>Campus not found</div>

  // Convert JsonValue to a plain object for the client
  const campusProps = {
    id: campus.id,
    name: campus.name,
    settings: (campus.settings as Record<string, unknown>) ?? {},
  }

  return <SettingsForm campus={campusProps} />
}