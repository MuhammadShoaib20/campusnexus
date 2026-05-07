"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: any
  allowedRoles: string[]
}

const navItems: NavItem[] = [
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

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const filteredItems = navItems.filter((item) =>
    item.allowedRoles.includes(session?.user?.role ?? "")
  )

  return (
    <div
      className={cn(
        "flex h-full flex-col transition-all duration-300 border-r border-slate-200 bg-white",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
        {!collapsed && <div className="text-lg font-semibold">Campus Admin</div>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-slate-100",
                pathname === item.href
                  ? "bg-slate-100 text-slate-950"
                  : "text-slate-600",
                collapsed && "justify-center"
              )}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-200 p-4">
        {!collapsed && (
          <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
            Welcome back, {session?.user?.name ?? "Admin"}
          </div>
        )}
      </div>
    </div>
  )
}
