"use client"

type ResultData = {
  id: string
  name: string
  date: string
  examSubjects: {
    subject: { name: string }
    maxMarks: number
    marks: { obtainedMarks: number }[]
  }[]
}

export default function ChildResultsClient({
  student,
  exams,
}: {
  student: { firstName: string; lastName: string }
  exams: ResultData[]
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Exam Results</h1>
      <p className="mb-4">{student.firstName} {student.lastName}</p>
      {exams.length === 0 && <p>No exam results available.</p>}
      {exams.map(exam => {
        const total = exam.examSubjects.reduce((sum, es) => sum + (es.marks[0]?.obtainedMarks ?? 0), 0)
        const maxTotal = exam.examSubjects.reduce((s, es) => s + es.maxMarks, 0)
        return (
          <div key={exam.id} className="mb-4 border p-3 rounded">
            <h2 className="font-semibold">{exam.name} ({new Date(exam.date).toLocaleDateString("en-CA")})</h2>
            <table className="w-full mt-2">
              <thead><tr className="bg-gray-50"><th className="p-1">Subject</th><th className="p-1">Marks</th></tr></thead>
              <tbody>
                {exam.examSubjects.map(es => (
                  <tr key={es.subject.name} className="border-t">
                    <td className="p-1">{es.subject.name}</td>
                    <td className="p-1">{es.marks[0]?.obtainedMarks ?? 0} / {es.maxMarks}</td>
                  </tr>
                ))}
                <tr className="font-medium"><td>Total</td><td>{total} / {maxTotal}</td></tr>
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}