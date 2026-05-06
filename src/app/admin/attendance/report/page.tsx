import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ReportClient from "./ReportClient"

export default async function AttendanceReportPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const campusId = session.user.campusId
  const classes = await prisma.class.findMany({ where: { campusId }, orderBy: { name: "asc" } })
  return <ReportClient classes={classes} />
}