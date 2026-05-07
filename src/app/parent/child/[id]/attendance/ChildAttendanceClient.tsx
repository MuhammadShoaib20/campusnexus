"use client"

type Record = { id: string; date: Date; status: string }

export default function ChildAttendanceClient({
  student,
  records,
}: {
  student: { firstName: string; lastName: string; class?: { name: string } | null }
  records: Record[]
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Attendance</h1>
      <p className="mb-4">{student.firstName} {student.lastName} - {student.class?.name}</p>
      <table className="w-full border">
        <thead><tr className="bg-gray-100"><th className="p-2">Date</th><th className="p-2">Status</th></tr></thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{new Date(r.date).toLocaleDateString("en-CA")}</td>
              <td className="p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}