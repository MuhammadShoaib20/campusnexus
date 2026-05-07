"use client"

type Announcement = {
  id: string
  title: string
  content?: string
  creator: { name: string }
}

export default function ParentAnnouncementsClient({ announcements }: { announcements: Announcement[] }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      {announcements.map(a => (
        <div key={a.id} className="border p-3 mb-2">
          <h2 className="font-semibold">{a.title}</h2>
          <p className="text-sm">{a.content}</p>
          <p className="text-xs text-gray-500">By {a.creator.name}</p>
        </div>
      ))}
    </div>
  )
}