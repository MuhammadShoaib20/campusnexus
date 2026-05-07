import NotificationBell from "./NotificationBell"
import LanguageSwitcher from "./LanguageSwitcher"

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-xl font-bold">DEBS Admin</h1>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <NotificationBell />
      </div>
    </header>
  )
}
