"use client"

import { useState } from "react"

type AssignmentItem = {
  id: string
  title: string
  type: string
  dueDate?: string
  creator: { name: string }
}

export default function TeacherAssignmentsClient({
  classData,
  assignments: initialAssignments,
}: {
  classData: { id: string; name: string }
  assignments: AssignmentItem[]
}) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState("ANNOUNCEMENT")
  const [dueDate, setDueDate] = useState("")
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!title) return alert("Title required")
    setSaving(true)
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId: classData.id, title, content, type, dueDate: dueDate || null }),
    })
    if (res.ok) {
      window.location.reload()
    } else alert("Failed to create")
    setSaving(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assignments for {classData.name}</h1>
      <div className="mb-6 p-4 border rounded space-y-2">
        <h2 className="font-semibold">Create New</h2>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 rounded w-full" />
        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} className="border p-2 rounded w-full" />
        <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded">
          <option>ANNOUNCEMENT</option>
          <option>HOMEWORK</option>
        </select>
        {type === "HOMEWORK" && (
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="border p-2 rounded" />
        )}
        <button onClick={handleCreate} disabled={saving} className="bg-green-500 text-white px-4 py-2 rounded">
          {saving ? "Creating..." : "Post"}
        </button>
      </div>
      <h2 className="font-semibold mb-2">Existing</h2>
      {initialAssignments.map(a => (
        <div key={a.id} className="border p-3 mb-2">
          <p className="font-medium">{a.title} ({a.type})</p>
          <p className="text-sm text-gray-600">By {a.creator.name}</p>
          {a.dueDate && <p className="text-sm">Due: {new Date(a.dueDate).toLocaleDateString("en-CA")}</p>}
        </div>
      ))}
    </div>
  )
}