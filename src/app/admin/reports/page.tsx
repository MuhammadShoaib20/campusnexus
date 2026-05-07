import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ReportClient from "./ReportClient"

export default async function ReportsPage() {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role)) redirect("/login")
  return <ReportClient />
}
