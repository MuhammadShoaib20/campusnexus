"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type Expense = {
  id: string
  description: string
  amount: number
  date: string
}

export default function ExpensesClient() {
  const { data: session } = useSession()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch("/api/expenses")
      .then(res => res.json())
      .then(setExpenses)
  }, [session])

  const handleAdd = async () => {
    if (!description || !amount || !date) return alert("Fill all fields")
    setLoading(true)
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, amount: parseFloat(amount), date }),
    })
    if (res.ok) {
      setDescription("")
      setAmount("")
      setDate(new Date().toISOString().slice(0, 10))
      const data = await fetch("/api/expenses").then(r => r.json())
      setExpenses(data)
    } else {
      alert("Failed to add")
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/expenses?id=${id}`, { method: "DELETE" })
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} className="border-t border-gray-200">
                <td className="p-2">{new Date(e.date).toLocaleDateString("en-CA")}</td>
                <td className="p-2">{e.description}</td>
                <td className="p-2">{e.amount}</td>
                <td className="p-2">
                  <button onClick={() => handleDelete(e.id)} className="text-red-600">
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
