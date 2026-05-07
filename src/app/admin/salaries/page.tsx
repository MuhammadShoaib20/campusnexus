import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import SalariesClient from "./SalariesClient"

export default async function SalariesPage() {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role)) redirect("/login")

  const users = await prisma.user.findMany({
    where: { campusId: session.user.campusId, role: { in: ["TEACHER", "ADMIN", "SUPER_ADMIN", "ACCOUNTANT"] } },
    select: { id: true, name: true, email: true },
  })

  return <SalariesClient users={users} />
}
