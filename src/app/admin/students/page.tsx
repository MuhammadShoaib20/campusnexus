import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import AdminHeader from "@/components/AdminHeader"

export default async function StudentsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // We'll fetch students client-side for dynamic updates, but for initial list we can do server fetch.
  // We'll just render the basic structure with a client component table.
  return (
    <div>
      <AdminHeader />
      <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="flex gap-2">
          <Link href="/admin/students/import" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Bulk Import CSV
          </Link>
          <Link href="/admin/students/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Student
          </Link>
        </div>
      </div>
      {/* Client component for interactive table */}
      <StudentsTable />
      </div>
    </div>
  )
}

// We'll put the table in a separate client component
import StudentsTable from "./StudentsTable"