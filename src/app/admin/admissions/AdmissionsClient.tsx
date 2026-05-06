"use client"

import { useState } from "react"
type Admission = {
  id: string
  firstName: string
  lastName: string
  guardianName: string
  guardianPhone: string
  desiredClass?: string | null
  status: string
  createdAt: string
}

export default function AdmissionsClient({ admissions: initial }: { admissions: Admission[] }) {
  const [admissions, setAdmissions] = useState(initial)

 const handleAction = async (id: string, action: "APPROVED" | "REJECTED") => {
  const res = await fetch(`/api/admin/admissions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  })
  if (res.ok) {
    // Update local state immediately instead of router.refresh()
    setAdmissions(prev =>
      prev.map(adm =>
        adm.id === id ? { ...adm, status: action } : adm
      )
    )
  } else {
    alert("Action failed")
  }
}
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Class</th>
          <th className="p-2 text-left">Guardian</th>
          <th className="p-2 text-left">Phone</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {admissions.length === 0 && (
          <tr><td colSpan={6} className="p-4 text-center text-gray-500">No applications yet.</td></tr>
        )}
        {admissions.map((adm) => (
          <tr key={adm.id} className="border-t">
            <td className="p-2">{adm.firstName} {adm.lastName}</td>
            <td className="p-2">{adm.desiredClass ?? "—"}</td>
            <td className="p-2">{adm.guardianName}</td>
            <td className="p-2">{adm.guardianPhone}</td>
            <td className="p-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                adm.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                adm.status === "APPROVED" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"
              }`}>{adm.status}</span>
            </td>
            <td className="p-2 flex gap-1 justify-center">
              {adm.status === "PENDING" && (
                <>
                  <button onClick={() => handleAction(adm.id, "APPROVED")} className="bg-green-500 text-white px-2 py-1 rounded text-sm">Approve</button>
                  <button onClick={() => handleAction(adm.id, "REJECTED")} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Reject</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}