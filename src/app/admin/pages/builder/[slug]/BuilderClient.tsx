"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import GrapesEditor from "@/components/GrapesEditor"

interface PageData {
  id: string
  slug: string
  content: string
  title: string
}

export default function BuilderClient({ page }: { page: PageData }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const handleSave = async (html: string, css: string) => {
    setSaving(true)
    void css
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: page.slug,
          title: page.title,
          content: html,
          campusId: "default",
        }),
      })
      if (res.ok) {
        alert("Page saved successfully!")
        router.refresh()
      } else {
        alert("Failed to save page.")
      }
    } catch {
      alert("Error saving page.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <GrapesEditor
      initialHtml={page.content}
      onSave={handleSave}
      saving={saving}
    />
  )
}
