"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

type Defaulter = {
  id: string
  student: { firstName: string; lastName: string; guardianPhone?: string }
  month: number
  year: number
  totalAmount: number
}

export default function DefaultersPage() {
  const { data: session } = useSession()
  const [defaulters, setDefaulters] = useState<Defaulter[]>([])

  useEffect(() => {
    if (!session) return
    fetch("/api/fees/defaulters")
      .then(res => res.json())
      .then(data => setDefaulters(data))
  }, [session])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Defaulter List</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Student</th>
            <th className="p-2">Month/Year</th>
            <th className="p-2">Amount Due</th>
            <th className="p-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {defaulters.map(d => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.student.firstName} {d.student.lastName}</td>
              <td className="p-2">{d.month}/{d.year}</td>
              <td className="p-2">{d.totalAmount}</td>
              <td className="p-2">{d.student.guardianPhone || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}