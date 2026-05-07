"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type ClassItem = { id: string; name: string }
type SubjectItem = { id: string; name: string }

type Exam = {
  id: string
  name: string
  date: string
  type: string
  class: {
    id: string
    name: string
  }
  examSubjects: {
    id: string
    subject: {
      id: string
      name: string
    }
  }[]
}

export default function ExamsClient({
  classes,
  subjects,
  exams: initialExams,
}: {
  classes: ClassItem[]
  subjects: SubjectItem[]
  exams: Exam[]
}) {
  const router = useRouter()
  const [selectedClass, setSelectedClass] = useState("")
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [type, setType] = useState("Midterm")
  const [selectedSubjects, setSelectedSubjects] = useState<Record<string, string>>({})

  const handleAddSubject = () => {
    setSelectedSubjects(prev => ({ ...prev, "": "" }))
  }

  const updateSubject = (oldId: string, newId: string) => {
    const updated = { ...selectedSubjects }
    if (oldId !== newId && newId in updated) return
    const max = updated[oldId]
    delete updated[oldId]
    updated[newId] = max
    setSelectedSubjects(updated)
  }

  const updateMaxMarks = (subjectId: string, max: string) => {
    setSelectedSubjects(prev => ({ ...prev, [subjectId]: max }))
  }

  const removeSubject = (id: string) => {
    const updated = { ...selectedSubjects }
    delete updated[id]
    setSelectedSubjects(updated)
  }

  const handleCreate = async () => {
    if (!selectedClass || !name || !date || Object.keys(selectedSubjects).length === 0) {
      return alert("Fill all fields and add at least one subject")
    }
    const subjectsArray = Object.entries(selectedSubjects).map(([id, max]) => ({
      subjectId: id,
      maxMarks: parseFloat(max),
    }))
    const res = await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId: selectedClass, name, date, type, subjects: subjectsArray }),
    })
    if (res.ok) {
      router.refresh()
      window.location.reload()
    } else {
      alert("Failed to create exam")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Exams</h1>
      <div className="mb-6 p-4 border rounded space-y-2">
        <h2 className="font-semibold">Create New Exam</h2>
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Select Class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Exam Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded w-full" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded w-full" />
        <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded w-full">
          <option>Midterm</option>
          <option>Final</option>
          <option>Test</option>
        </select>
        <div className="space-y-1">
          <p className="font-medium">Subjects:</p>
          {Object.entries(selectedSubjects).map(([id, max]) => (
            <div key={id} className="flex gap-2 items-center">
              <select value={id} onChange={e => updateSubject(id, e.target.value)} className="border p-1 rounded flex-1">
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="number" placeholder="Max Marks" value={max} onChange={e => updateMaxMarks(id, e.target.value)} className="border p-1 rounded w-24" />
              <button onClick={() => removeSubject(id)} className="text-red-500">✕</button>
            </div>
          ))}
          <button onClick={handleAddSubject} className="text-blue-500 text-sm">+ Add Subject</button>
        </div>
        <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded">Create Exam</button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Existing Exams</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Class</th>
            <th className="p-2">Date</th>
            <th className="p-2">Subjects</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {initialExams.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">No exams yet.</td>
            </tr>
          )}
          {initialExams.map((exam) => (
            <tr key={exam.id} className="border-t">
              <td className="p-2">{exam.name}</td>
              <td className="p-2">{exam.class.name}</td>
             <td className="p-2">{exam.date.slice(0, 10)}</td>
              <td className="p-2">{exam.examSubjects.map(es => es.subject.name).join(", ")}</td>
              <td className="p-2">
                <a href={`/admin/exams/${exam.id}/marks`} className="text-blue-600 hover:underline mr-2">Enter Marks</a>
                <a href={`/admin/exams/${exam.id}/results`} className="text-green-600 hover:underline">View Results</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}