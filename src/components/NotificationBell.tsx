"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { useSession } from "next-auth/react"

type Notification = {
  id: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export default function NotificationBell() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const initFetch = async () => {
      if (!session) return
      const res = await fetch("/api/notifications?unread=true")
      const data = await res.json()
      setNotifications(data)
      setUnreadCount(data.length)
    }
    
    initFetch()
    const interval = setInterval(initFetch, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [session])

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const toggleOpen = () => setOpen((prev) => !prev)

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b font-semibold text-gray-700">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                  !n.read ? "bg-blue-50" : ""
                }`}
                onClick={() => markAsRead(n.id)}
              >
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
