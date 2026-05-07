import Link from "next/link"
import NotificationBell from "./NotificationBell"
import LanguageSwitcher from "./LanguageSwitcher"

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-xl font-bold">DEBS Admin</h1>
      <div className="flex items-center gap-4">
        <Link href="/admin/assistant" className="text-sm text-blue-600 hover:underline">
          AI Assistant
        </Link>
        <LanguageSwitcher />
        <NotificationBell />
      </div>
    </header>
  )
}
