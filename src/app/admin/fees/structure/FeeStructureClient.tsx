"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type ClassItem = { id: string; name: string }
type Structure = { id: string; classId: string; feeType: string; amount: number; class: ClassItem }

export default function FeeStructureClient({
  classes,
  structures: initialStructures,
}: {
  classes: ClassItem[]
  structures: Structure[]
}) {
  const [structures, setStructures] = useState(initialStructures)
  const [classId, setClassId] = useState("")
  const [feeType, setFeeType] = useState("")
  const [amount, setAmount] = useState("")
  const router = useRouter()

  const handleAdd = async () => {
    if (!classId || !feeType || !amount) return alert("Fill all fields")
    const res = await fetch("/api/fees/structure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, feeType, amount: parseFloat(amount) }),
    })
    if (res.ok) {
      router.refresh()
      setClassId("")
      setFeeType("")
      setAmount("")
    }
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/fees/structure?id=${id}`, { method: "DELETE" })
    setStructures(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fee Structures</h1>
      <div className="flex gap-2 mb-4">
        <select value={classId} onChange={e => setClassId(e.target.value)} className="border p-2 rounded">
          <option value="">Select Class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Fee Type (e.g. Tuition)" value={feeType} onChange={e => setFeeType(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 rounded" />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Class</th>
            <th className="p-2">Fee Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {structures.map(s => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.class.name}</td>
              <td className="p-2">{s.feeType}</td>
              <td className="p-2">{s.amount}</td>
              <td className="p-2"><button onClick={() => handleDelete(s.id)} className="text-red-600">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}