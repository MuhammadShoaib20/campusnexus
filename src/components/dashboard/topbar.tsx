"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, LogOut, User } from "lucide-react"
import NotificationBell from "@/components/NotificationBell"

export default function Topbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex-1" />
      <NotificationBell />
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
          <Avatar className="h-10 w-10">
            <AvatarFallback>{session?.user?.name?.[0] ?? "A"}</AvatarFallback>
          </Avatar>
        </Button>
        {menuOpen && (
          <div className="absolute right-0 top-12 w-56 rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">{session?.user?.name}</p>
              <p className="text-xs text-slate-500">{session?.user?.email}</p>
            </div>
            <div className="border-t border-slate-200" />
            <button
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setMenuOpen(false)
                router.push("/admin/settings")
              }}
            >
              <User size={16} /> Profile Settings
            </button>
            <button
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
