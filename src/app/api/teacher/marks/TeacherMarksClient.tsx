"use client"

import Link from "next/link"

type Exam = { id: string; name: string; date: string }

export default function TeacherMarksClient({ exams }: { exams: Exam[] }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enter Marks</h1>
      {exams.map((exam) => (
        <div key={exam.id} className="border p-3 mb-2">
          <span>
            {exam.name} ({new Date(exam.date).toLocaleDateString("en-CA")})
          </span>
          <Link
            href={`/admin/exams/${exam.id}/marks`}
            className="ml-4 text-blue-600 hover:underline"
          >
            Enter Marks
          </Link>
        </div>
      ))}
    </div>
  )
}