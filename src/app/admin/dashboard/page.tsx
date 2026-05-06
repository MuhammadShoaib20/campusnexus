import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function Dashboard() {
  const session = await auth()
  if (!session) redirect("/login")

  const campusId = session.user.campusId
  const [totalStudents, recent] = await Promise.all([
    prisma.student.count({ where: { campusId } }),
    prisma.student.findMany({ where: { campusId }, orderBy: { createdAt: "desc" }, take: 5 })
  ])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Students</p>
          <p className="text-3xl font-bold">{totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Today Attendance</p>
          <p className="text-3xl font-bold">—</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Fee Collection</p>
          <p className="text-3xl font-bold">—</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Admissions</h2>
        <ul className="list-disc list-inside">
          {recent.map((s) => (
            <li key={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber ?? 'N/A'})</li>
          ))}
        </ul>
      </div>
    </div>
  )
}