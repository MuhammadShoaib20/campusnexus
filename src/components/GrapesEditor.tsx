"use client"

import { useEffect, useRef } from "react"
import grapesjs, { Editor } from "grapesjs"
import "grapesjs/dist/css/grapes.min.css"

interface GrapesEditorProps {
  initialHtml: string
  initialCss?: string
  onSave: (html: string, css: string) => Promise<void>
  saving: boolean
}

export default function GrapesEditor({
  initialHtml,
  initialCss = "",
  onSave,
  saving,
}: GrapesEditorProps) {
  const editorRef = useRef<Editor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return

    const editor = grapesjs.init({
      container: containerRef.current,
      fromElement: false,
      height: "100vh",
      width: "auto",
      storageManager: false,
      blockManager: {
        appendTo: "#blocks",
        blocks: [
          {
            id: "section",
            label: "Section",
            content: `<section class="p-4 bg-white rounded shadow"><h2>New Section</h2><p>Lorem ipsum</p></section>`,
          },
          {
            id: "hero",
            label: "Hero",
            content: `<div class="bg-blue-500 text-white p-10 text-center"><h1>Hero Title</h1><p>Subtitle</p><a href="#" class="btn">Apply Now</a></div>`,
          },
          {
            id: "card",
            label: "Card",
            content: `<div class="border rounded p-4"><h3>Card Title</h3><p>Card content</p></div>`,
          },
        ],
      },
      styleManager: {
        sectors: [
          {
            name: "General",
            properties: [
              { name: "Padding", property: "padding" },
              { name: "Margin", property: "margin" },
              { name: "Background", property: "background-color" },
            ],
          },
        ],
      },
    })

    editor.setComponents(initialHtml)
    editor.setStyle(initialCss)
    editorRef.current = editor

    return () => {
      editor.destroy()
      editorRef.current = null
    }
  }, [initialHtml, initialCss])

  const handleSave = async () => {
    if (!editorRef.current || saving) return
    const html = editorRef.current.getHtml() || ""
    const css = editorRef.current.getCss() || ""
    await onSave(html, css)
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-lg font-semibold">Page Builder</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Page"}
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div id="blocks" className="w-48 bg-gray-100 border-r p-2 overflow-y-auto" />
        <div ref={containerRef} className="flex-1" />
      </div>
    </div>
  )
}
