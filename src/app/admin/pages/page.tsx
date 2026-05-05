'use client'

import { useState } from 'react'
import Editor from '@/components/Editor'

export default function AdminPages() {
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    // For now, POST to a simple API route that creates/updates a Page
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, title, content, campusId: 'default' }),
    })
    const data = await res.json()
    if (res.ok) setMessage('Page saved successfully!')
    else setMessage(data.error || 'Error')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Page</h1>
      <div className="space-y-4">
      <input
  placeholder="Slug (e.g., about)"
  value={slug}
  onChange={(e) => setSlug(e.target.value)}
  className="border p-2 w-full rounded"
  suppressHydrationWarning
/>
      <input
  placeholder="Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="border p-2 w-full rounded"
  suppressHydrationWarning
/>
        <Editor content={content} onChange={setContent} />
        <button onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Page
        </button>
        {message && <p className="text-green-600">{message}</p>}
      </div>
    </div>
  )
}