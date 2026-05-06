"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

type ClassItem = { id: string; name: string }

export default function ReportClient({ classes }: { classes: ClassItem[] }) {
  const { data: session } = useSession()
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [classId, setClassId] = useState("")
  const [report, setReport] = useState({ total: 0, present: 0, absent: 0, late: 0 })
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    if (!session || !date) return
    setLoading(true)
    const params = new URLSearchParams()
    params.set("date", date)
    if (classId) params.set("classId", classId)
    const res = await fetch(`/api/attendance/report?${params}`)
    const data = await res.json()
    setReport(data)
    setLoading(false)
  }

  if (!session) return null

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daily Attendance Report</h1>
      <div className="flex gap-2 mb-4">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
        <select value={classId} onChange={e => setClassId(e.target.value)} className="border p-2 rounded">
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={fetchReport} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          View Report
        </button>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 shadow rounded"><span className="text-gray-500">Total</span><p className="text-2xl font-bold">{report.total}</p></div>
          <div className="bg-green-50 p-4 shadow rounded"><span className="text-green-700">Present</span><p className="text-2xl font-bold text-green-700">{report.present}</p></div>
          <div className="bg-red-50 p-4 shadow rounded"><span className="text-red-700">Absent</span><p className="text-2xl font-bold text-red-700">{report.absent}</p></div>
          <div className="bg-yellow-50 p-4 shadow rounded"><span className="text-yellow-700">Late</span><p className="text-2xl font-bold text-yellow-700">{report.late}</p></div>
        </div>
      )}
    </div>
  )
}