"use client"

import { useState,} from "react"
import { useRouter } from "next/navigation"

type Student = {
  id: string
  firstName: string
  lastName: string
}

type Subject = {
  id: string
  name: string
}

type ExamSubject = {
  id: string
  subject: Subject
  maxMarks: number
}

type Mark = {
  studentId: string
  obtainedMarks: number
}

type ExamSubjectWithMarks = ExamSubject & {
  marks: Mark[]
}

type ExamWithDetails = {
  id: string
  name: string
  date: string
  class: {
    id: string
    name: string
    students: Student[]
  }
  examSubjects: ExamSubjectWithMarks[]
}

export default function MarksClient({ exam }: { exam: ExamWithDetails }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // Initialize marks from existing data using useMemo (no effect, no sync setState)
  const [marksData, setMarksData] = useState<Record<string, Record<string, string>>>(() => {
    const initial: Record<string, Record<string, string>> = {}
    exam.examSubjects.forEach((es: ExamSubjectWithMarks) => {
      es.marks.forEach((m: Mark) => {
        if (!initial[m.studentId]) initial[m.studentId] = {}
        initial[m.studentId][es.id] = m.obtainedMarks.toString()
      })
    })
    return initial
  })

  const handleChange = (studentId: string, examSubjectId: string, value: string) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [examSubjectId]: value,
      },
    }))
  }

  const handleSave = async () => {
    const marks: { studentId: string; examSubjectId: string; obtainedMarks: number }[] = []
    Object.entries(marksData).forEach(([studentId, subjects]) => {
      Object.entries(subjects).forEach(([examSubjectId, obtained]) => {
        marks.push({
          studentId,
          examSubjectId,
          obtainedMarks: parseFloat(obtained) || 0,
        })
      })
    })
    setSaving(true)
    const res = await fetch("/api/marks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marks }),
    })
    if (res.ok) {
      alert("Marks saved!")
      router.refresh()
    } else {
      alert("Failed to save marks")
    }
    setSaving(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Enter Marks: {exam.name}</h1>
      <p className="mb-4 text-gray-600">Class: {exam.class.name}</p>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Student</th>
            {exam.examSubjects.map((es: ExamSubjectWithMarks) => (
              <th key={es.id} className="p-2">
                {es.subject.name} ({es.maxMarks})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {exam.class.students.map((student: Student) => (
            <tr key={student.id} className="border-t">
              <td className="p-2">
                {student.firstName} {student.lastName}
              </td>
              {exam.examSubjects.map((es: ExamSubjectWithMarks) => (
                <td key={es.id} className="p-2">
                  <input
                    type="number"
                    min="0"
                    max={es.maxMarks}
                    value={marksData[student.id]?.[es.id] || ""}
                    onChange={e =>
                      handleChange(student.id, es.id, e.target.value)
                    }
                    className="border p-1 w-20 rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save All Marks"}
      </button>
    </div>
  )
}