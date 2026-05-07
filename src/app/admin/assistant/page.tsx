import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AssistantClient from "./AssistantClient"

export default async function AssistantPage() {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role)) {
    redirect("/login")
  }
  return <AssistantClient />
}