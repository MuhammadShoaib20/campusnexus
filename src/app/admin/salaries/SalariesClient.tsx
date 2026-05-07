"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type User = { id: string; name: string; email: string }
type Salary = { id: string; userId: string; user: { name: string }; amount: number; month: number; year: number }

export default function SalariesClient({ users }: { users: User[] }) {
  const { data: session } = useSession()
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [userId, setUserId] = useState("")
  const [amount, setAmount] = useState("")
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)

  const fetchSalaries = async () => {
    if (!session) return
    const res = await fetch("/api/salaries")
    setSalaries(await res.json())
  }

  useEffect(() => { fetchSalaries() }, [session])

  const handleAdd = async () => {
    if (!userId || !amount) return alert("Select user and amount")
    setLoading(true)
    const res = await fetch("/api/salaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount: parseFloat(amount), month, year }),
    })
    if (res.ok) {
      setAmount("")
      setUserId("")
      fetchSalaries()
    } else {
      alert("Failed")
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/salaries?id=${id}`, { method: "DELETE" })
    setSalaries(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Salaries</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        <select value={userId} onChange={e => setUserId(e.target.value)} className="border p-2 rounded">
          <option value="">Select Employee</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="border p-2 rounded"
        />
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
        <button onClick={handleAdd} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Saving..." : "Add"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Period</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {salaries.map(s => (
              <tr key={s.id} className="border-t border-gray-200">
                <td className="p-2">{s.user.name}</td>
                <td className="p-2">{s.month}/{s.year}</td>
                <td className="p-2">{s.amount}</td>
                <td className="p-2">
                  <button onClick={() => handleDelete(s.id)} className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
