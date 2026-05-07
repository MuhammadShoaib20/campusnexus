"use client"

import { useState } from "react"

type Student = { id: string; firstName: string; lastName: string }

export default function TeacherAttendanceClient({
  classData,
  students,
}: {
  classData: { id: string; name: string }
  students: Student[]
}) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [statusMap, setStatusMap] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const handleStatusChange = (studentId: string, status: string) => {
    setStatusMap(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    const records = students.map(s => ({
      studentId: s.id,
      date,
      status: statusMap[s.id] || "ABSENT",
      method: "MANUAL",
    }))
    setSaving(true)
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records }),
    })
    if (res.ok) alert("Attendance saved!")
    else alert("Failed to save")
    setSaving(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Take Attendance: {classData.name}</h1>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded mb-4" />
      <table className="w-full border">
        <thead><tr className="bg-gray-100"><th className="p-2">Name</th><th className="p-2">Status</th></tr></thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.firstName} {s.lastName}</td>
              <td className="p-2">
                <select
                  value={statusMap[s.id] || "PRESENT"}
                  onChange={e => handleStatusChange(s.id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">Late</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave} disabled={saving} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  )
}