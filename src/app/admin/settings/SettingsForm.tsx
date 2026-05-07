"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type CampusProps = {
  id: string
  name: string
  settings: Record<string, unknown>
}

export default function SettingsForm({ campus }: { campus: CampusProps }) {
  const router = useRouter()
  const settings = campus.settings

  const [form, setForm] = useState({
    logoUrl: (settings.logoUrl as string) || "",
    primaryColor: (settings.primaryColor as string) || "#1e40af",
    address: (settings.address as string) || "",
    phone: (settings.phone as string) || "",
    email: (settings.email as string) || "",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleUploadLogo = async () => {
    if (!logoFile) return
    setUploading(true)
    const data = new FormData()
    data.append("image", logoFile)
    const res = await fetch("/api/upload", { method: "POST", body: data })
    const json = await res.json()
    if (json.url) {
      setForm(prev => ({ ...prev, logoUrl: json.url }))
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch("/api/campus/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: campus.id, settings: form }),
    })
    if (res.ok) {
      setMessage("Settings saved.")
      router.refresh()
    } else {
      setMessage("Error saving settings.")
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Campus Settings</h1>

      {/* Name (read-only) */}
      <label className="block mb-2">
        Campus Name
        <input value={campus.name} disabled className="border p-2 w-full rounded bg-gray-100" />
      </label>

      {/* Logo */}
      <label className="block mb-2">
        Logo
        {form.logoUrl && (
          <Image
            src={form.logoUrl}
            alt="Campus Logo"
            width={48}
            height={48}
            className="h-12 object-contain"
          />
        )}
        <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] ?? null)} />
        <button type="button" onClick={handleUploadLogo} disabled={!logoFile || uploading}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded">
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </label>

      {/* Primary Color */}
      <label className="block mb-2">
        Primary Color
        <input type="color" value={form.primaryColor} onChange={e => setForm(prev => ({ ...prev, primaryColor: e.target.value }))}
          className="ml-2 border p-1 rounded" />
      </label>

      {/* Address */}
      <label className="block mb-2">
        Address
        <input value={form.address} onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
          className="border p-2 w-full rounded" />
      </label>

      {/* Phone */}
      <label className="block mb-2">
        Phone
        <input value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
          className="border p-2 w-full rounded" />
      </label>

      {/* Email */}
      <label className="block mb-2">
        Email
        <input value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
          className="border p-2 w-full rounded" />
      </label>

      <button onClick={handleSave} disabled={saving}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        {saving ? "Saving..." : "Save Settings"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  )
}