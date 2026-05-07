"use client"

type Student = {
  id: string
  firstName: string
  lastName: string
}

type ExamSubjectWithMarks = {
  id: string
  subject: { name: string }
  maxMarks: number
  marks: { studentId: string; obtainedMarks: number }[]
}

type ExamWithStudents = {
  id: string
  name: string
  class: { students: Student[] }
  examSubjects: ExamSubjectWithMarks[]
}

export default function ResultsClient({ exam }: { exam: ExamWithStudents }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Results: {exam.name}</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Student</th>
            <th className="p-2">Subjects</th>
            <th className="p-2">Total</th>
            <th className="p-2">Result Card</th>
          </tr>
        </thead>
        <tbody>
          {exam.class.students.map((student: Student) => {
            const total = exam.examSubjects.reduce(
              (sum: number, es: ExamSubjectWithMarks) => {
                const mark = es.marks.find(
                  (m: { studentId: string; obtainedMarks: number }) =>
                    m.studentId === student.id
                )
                return sum + (mark?.obtainedMarks ?? 0)
              },
              0
            )
            const maxTotal = exam.examSubjects.reduce(
              (s: number, es: ExamSubjectWithMarks) => s + es.maxMarks,
              0
            )
            return (
              <tr key={student.id} className="border-t">
                <td className="p-2">
                  {student.firstName} {student.lastName}
                </td>
                <td className="p-2">
                  {exam.examSubjects
                    .map((es: ExamSubjectWithMarks) => {
                      const mark = es.marks.find(
                        (m: { studentId: string; obtainedMarks: number }) =>
                          m.studentId === student.id
                      )
                      return `${es.subject.name}: ${mark?.obtainedMarks ?? 0}/${es.maxMarks}`
                    })
                    .join(", ")}
                </td>
                <td className="p-2 font-medium">
                  {total} / {maxTotal}
                </td>
                <td className="p-2">
                  <a
                    href={`/api/exams/${exam.id}/result/${student.id}`}
                    className="text-blue-600 underline"
                  >
                    Download PDF
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}