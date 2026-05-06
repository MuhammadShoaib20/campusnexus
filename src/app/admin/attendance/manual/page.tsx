import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ManualAttendanceClient from "./ManualAttendanceClient"

export default async function ManualAttendancePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const campusId = session.user.campusId
  const classes = await prisma.class.findMany({ where: { campusId }, orderBy: { name: "asc" } })

  return <ManualAttendanceClient classes={classes} />
}