import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {session.user?.name} ({session.user?.role})</p>
      <p>Campus: {session.user?.campusId}</p>
    </div>
  )
}