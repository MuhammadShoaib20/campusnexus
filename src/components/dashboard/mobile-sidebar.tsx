"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Menu,
  LayoutDashboard,
  Users,
  GraduationCap,
  Banknote,
  CalendarCheck,
  BookOpen,
  FileText,
  Settings,
  MessageSquare,
  UserCog,
  Image,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, allowedRoles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT", "TEACHER"] },
  { title: "Students", href: "/admin/students", icon: Users, allowedRoles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"] },
  { title: "Admissions", href: "/admin/admissions", icon: GraduationCap, allowedRoles: ["SUPER_ADMIN", "ADMIN"] },
  { title: "Fees", href: "/admin/fees", icon: Banknote, allowedRoles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"] },
  { title: "Attendance", href: "/admin/attendance", icon: CalendarCheck, allowedRoles: ["SUPER_ADMIN", "ADMIN", "TEACHER"] },
  { title: "Exams", href: "/admin/exams", icon: BookOpen, allowedRoles: ["SUPER_ADMIN", "ADMIN", "TEACHER"] },
  { title: "CMS", href: "/admin/pages", icon: FileText, allowedRoles: ["SUPER_ADMIN", "ADMIN"] },
  { title: "AI Assistant", href: "/admin/assistant", icon: MessageSquare, allowedRoles: ["SUPER_ADMIN", "ADMIN"] },
  { title: "Users", href: "/admin/users", icon: UserCog, allowedRoles: ["SUPER_ADMIN"] },
  { title: "Settings", href: "/admin/settings", icon: Settings, allowedRoles: ["SUPER_ADMIN", "ADMIN"] },
]

export default function MobileSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const filteredItems = navItems.filter((item) =>
    item.allowedRoles.includes(session?.user?.role ?? "")
  )

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50"
        onClick={() => setOpen(true)}
      >
        <Menu size={18} />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-72 border-r border-slate-200 bg-white p-4">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-lg font-semibold">Campus Admin</div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                ✕
              </Button>
            </div>
            <nav className="space-y-2">
              {filteredItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${pathname === item.href ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-100"}`}
                >
                  <item.icon size={18} />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
