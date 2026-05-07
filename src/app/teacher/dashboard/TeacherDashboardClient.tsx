"use client"

import Link from "next/link"

type ClassItem = { id: string; name: string }

export default function TeacherDashboardClient({ classes }: { classes: ClassItem[] }) {
  if (classes.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">No Classes Assigned</h1>
        <p>Please contact the administrator to assign you to classes.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <div className="space-y-4">
        {classes.map(cls => (
          <div key={cls.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{cls.name}</h2>
            <div className="flex gap-4 mt-2">
              <Link href={`/teacher/attendance?classId=${cls.id}`} className="text-blue-600 hover:underline">
                Take Attendance
              </Link>
              <Link href={`/teacher/marks?classId=${cls.id}`} className="text-blue-600 hover:underline">
                Enter Marks
              </Link>
              <Link href={`/teacher/assignments?classId=${cls.id}`} className="text-blue-600 hover:underline">
                Manage Assignments
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}