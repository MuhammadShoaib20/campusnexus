"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

type ReportState = {
  income: number
  expenses: number
  salaries: number
  net: number
}

export default function ReportClient() {
  const { data: session } = useSession()
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [report, setReport] = useState<ReportState>({ income: 0, expenses: 0, salaries: 0, net: 0 })
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    if (!session) return
    setLoading(true)
    const res = await fetch(`/api/reports/pl?month=${month}&year=${year}`)
    if (res.ok) {
      setReport(await res.json())
    }
    setLoading(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profit & Loss Report</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        <select value={month} onChange={e => setMonth(Number(e.target.value))} className="border p-2 rounded">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="border p-2 rounded w-24"
        />
        <button onClick={fetchReport} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Loading..." : "View"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Fee Income</p>
          <p className="text-2xl font-bold text-green-600">{report.income}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Expenses</p>
          <p className="text-2xl font-bold text-red-600">{report.expenses}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Salaries</p>
          <p className="text-2xl font-bold text-red-600">{report.salaries}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Net Profit</p>
          <p className={`text-2xl font-bold ${report.net >= 0 ? "text-green-600" : "text-red-600"}`}>{report.net}</p>
        </div>
      </div>
    </div>
  )
}
