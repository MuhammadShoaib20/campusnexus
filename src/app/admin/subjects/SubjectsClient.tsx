"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Subject = { id: string; name: string; code?: string | null }

export default function SubjectsClient({ subjects: initial }: { subjects: Subject[] }) {
  const [subjects, setSubjects] = useState(initial)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const router = useRouter()

  const handleAdd = async () => {
    if (!name) return alert("Name required")
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code }),
    })
    if (res.ok) {
      router.refresh()
      setName("")
      setCode("")
    } else alert("Failed to add subject")
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/subjects?id=${id}`, { method: "DELETE" })
    setSubjects(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subjects</h1>
      <div className="flex gap-2 mb-4">
        <input placeholder="Subject Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Code (optional)" value={code} onChange={e => setCode(e.target.value)} className="border p-2 rounded" />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>
      <table className="w-full border">
        <thead><tr className="bg-gray-100"><th className="p-2">Name</th><th className="p-2">Code</th><th className="p-2">Actions</th></tr></thead>
        <tbody>
          {subjects.map(s => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.code ?? "—"}</td>
              <td className="p-2"><button onClick={() => handleDelete(s.id)} className="text-red-600">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}