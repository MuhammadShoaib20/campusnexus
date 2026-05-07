"use client"

import Link from "next/link"

type Child = {
  id: string
  firstName: string
  lastName: string
  classId?: string | null
  class?: { name: string } | null
}

export default function ParentDashboardClient({ childList }: { childList: Child[] }) {
  if (childList.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">No Children Linked</h1>
        <p>Please contact the school to link your child&rsquo;s account.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Children</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {childList.map((child) => (
          <div key={child.id} className="border rounded p-4 shadow hover:shadow-md">
            <h2 className="text-lg font-semibold">
              {child.firstName} {child.lastName}
            </h2>
            <p className="text-sm text-gray-600">{child.class?.name ?? "No class"}</p>
            <div className="mt-3 flex flex-col gap-1">
              <Link
                href={`/parent/child/${child.id}/attendance`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Attendance
              </Link>
              <Link
                href={`/parent/child/${child.id}/fees`}
                className="text-blue-600 hover:underline text-sm"
              >
                Fee Status
              </Link>
              <Link
                href={`/parent/child/${child.id}/results`}
                className="text-blue-600 hover:underline text-sm"
              >
                Exam Results
              </Link>
              <Link
                href={`/parent/announcements?classId=${child.classId}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Announcements
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}