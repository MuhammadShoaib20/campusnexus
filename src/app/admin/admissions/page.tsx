import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdmissionsClient from "./AdmissionsClient"

export default async function AdmissionsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const campusId = session.user.campusId
  const admissionsRaw = await prisma.admission.findMany({
    where: { campusId },
    orderBy: { createdAt: "desc" },
})

// Convert dates to strings to match the client type
const admissions = admissionsRaw.map((admission) => ({
    ...admission,
    createdAt: admission.createdAt.toISOString(),
}))

return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admission Applications</h1>
      <AdmissionsClient admissions={admissions} />
    </div>
)
}