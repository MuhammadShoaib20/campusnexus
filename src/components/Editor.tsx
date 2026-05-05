'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useState } from 'react'

const API_URL = '/api/upload'

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: { default: null },
    }
  },
})

export default function Editor({
  content,
  onChange,
}: {
  content: string
  onChange: (html: string) => void
}) {
  const [uploading, setUploading] = useState(false)

 const editor = useEditor({
  immediatelyRender: false,  // ← add this
  extensions: [StarterKit, CustomImage],
  content,
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML())
  },
})

 const addImage = async () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch(API_URL, { method: 'POST', body: formData })
    const data = await res.json()
    if (data.url && editor) {
      editor.chain().focus().setImage({ src: data.url }).run()
    }
    setUploading(false)
  }
  input.click()
}
  if (!editor) return null

  return (
    <div className="border rounded-lg p-4">
      <div className="flex gap-2 mb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 border rounded">Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2 py-1 border rounded">Italic</button>
        <button onClick={addImage} disabled={uploading}
          className="px-2 py-1 border rounded">
          {uploading ? 'Uploading...' : 'Image'}
        </button>
      </div>
      <EditorContent editor={editor} className="prose max-w-none" />
    </div>
  )
}