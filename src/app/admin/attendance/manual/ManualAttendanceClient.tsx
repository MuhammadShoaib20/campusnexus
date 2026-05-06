"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

type ClassItem = { id: string; name: string }
type Student = {
  id: string
  firstName: string
  lastName: string
  classId: string | null
}

export default function ManualAttendanceClient({ classes }: { classes: ClassItem[] }) {
  const { data: session } = useSession()
  const [selectedClass, setSelectedClass] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [students, setStudents] = useState<Student[]>([])
  const [statusMap, setStatusMap] = useState<Record<string, string>>({})  // studentId -> status
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!session || !selectedClass) return
    fetch(`/api/students?classId=${selectedClass}`)
      .then(res => res.json())
      .then(data => setStudents(data))
  }, [selectedClass, session])

  const handleStatusChange = (studentId: string, status: string) => {
    setStatusMap(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    if (!date || !selectedClass) return alert("Select class and date")
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
    if (res.ok) {
      alert("Attendance saved!")
    } else {
      alert("Failed to save attendance")
    }
    setSaving(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manual Attendance</h1>
      <div className="flex gap-4 mb-4">
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="border p-2 rounded">
          <option value="">Select Class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
      </div>

      {students.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
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
      )}

      {students.length > 0 && (
        <button onClick={handleSave} disabled={saving} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      )}
    </div>
  )
}