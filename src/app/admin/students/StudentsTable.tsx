"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type Student = {
  id: string
  firstName: string
  lastName: string
  admissionNumber?: string | null
  class?: { name: string } | null
  guardianPhone?: string | null
}

export default function StudentsTable() {
  const { data: session } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .finally(() => setLoading(false))
  }, [session])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student?")) return
    await fetch(`/api/students/${id}`, { method: "DELETE" })
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }

  if (loading) return <p>Loading...</p>

  return (
    <table className="w-full border">
      {/* table headers as before, no change */}
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Adm No</th>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Class</th>
          <th className="p-2 text-left">Phone</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.length === 0 && (
          <tr>
            <td colSpan={5} className="p-4 text-center text-gray-500">
              No students found.
            </td>
          </tr>
        )}
        {students.map((student) => (
          <tr key={student.id} className="border-t">
            <td className="p-2">{student.admissionNumber ?? "—"}</td>
            <td className="p-2">
              {student.firstName} {student.lastName}
            </td>
            <td className="p-2">{student.class?.name ?? "—"}</td>
            <td className="p-2">{student.guardianPhone ?? "—"}</td>
            <td className="p-2 flex gap-1 justify-center">
              <button
                onClick={() => router.push(`/admin/students/${student.id}`)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(student.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}