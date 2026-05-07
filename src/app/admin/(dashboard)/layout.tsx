import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import Topbar from "@/components/dashboard/topbar"
import MobileSidebar from "@/components/dashboard/mobile-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT", "TEACHER"]
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <MobileSidebar />
      <div className="lg:flex">
        <aside className="hidden lg:block lg:w-72 lg:min-h-screen lg:border-r lg:border-slate-200 lg:bg-white">
          <Sidebar />
        </aside>
        <div className="flex-1">
          <Topbar />
          <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
