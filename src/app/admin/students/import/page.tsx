"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Papa from "papaparse"

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Record<string, unknown>[]>([])
  const [importing, setImporting] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreview((results.data as Record<string, unknown>[]).slice(0, 5))
      },
    })
  }

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const res = await fetch("/api/students/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(results.data),
        })
        if (res.ok) {
          router.push("/admin/students")
        } else {
          alert("Import failed")
        }
        setImporting(false)
      },
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Bulk Import Students</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />
      {preview.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Preview (first 5 rows)</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                {preview[0] && Object.keys(preview[0]).map((key) => (
                  <th key={key} className="p-1 border">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="p-1 border">{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        onClick={handleImport}
        disabled={!file || importing}
        className="bg-green-500 text-white px-6 py-2 rounded"
      >
        {importing ? "Importing..." : "Import All"}
      </button>
    </div>
  )
}