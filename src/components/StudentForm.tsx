/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"     // ← useEffect hata diya
import { useRouter } from "next/navigation"

// Better type for student passed from server
type StudentForEdit = {
  id?: string
  firstName: string
  lastName: string
  admissionNumber?: string | null
  dateOfBirth?: string | null
  gender?: string | null
  classId?: string | null
  guardianName?: string | null
  guardianPhone?: string | null
  address?: string | null
  photoUrl?: string | null
}

type StudentInput = {
  firstName: string
  lastName: string
  admissionNumber: string
  dateOfBirth: string
  gender: string
  classId: string
  guardianName: string
  guardianPhone: string
  address: string
  photoUrl: string
}

export default function StudentForm({
  student,
  classes,
}: {
  student?: StudentForEdit
  classes: { id: string; name: string }[]
}) {
  const router = useRouter()
  const [form, setForm] = useState<StudentInput>({
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    admissionNumber: student?.admissionNumber || "",
    dateOfBirth: student?.dateOfBirth || "",
    gender: student?.gender || "",
    classId: student?.classId || "",
    guardianName: student?.guardianName || "",
    guardianPhone: student?.guardianPhone || "",
    address: student?.address || "",
    photoUrl: student?.photoUrl || "",
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePhotoUpload = async () => {
  if (!photoFile) return
  setUploading(true)
  const formData = new FormData()
  formData.append("image", photoFile)
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include",   // 👈 ye line add karo
  })
  const data = await res.json()
  if (!res.ok || data.error) {
    alert("Upload failed: " + (data.error || res.statusText))
    setUploading(false)
    return
  }
  if (data.url) {
    setForm(prev => ({ ...prev, photoUrl: data.url }))
  }
  setUploading(false)
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const url = student?.id ? `/api/students/${student.id}` : "/api/students"
    const method = student?.id ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push("/admin/students")
    } else {
      alert("Failed to save")
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">
        {student ? "Edit Student" : "Add Student"}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="border p-2 rounded" required />
        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="border p-2 rounded" required />
        <input name="admissionNumber" placeholder="Admission Number" value={form.admissionNumber} onChange={handleChange} className="border p-2 rounded" />
        <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="border p-2 rounded" />
        <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <select name="classId" value={form.classId} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input name="guardianName" placeholder="Guardian Name" value={form.guardianName} onChange={handleChange} className="border p-2 rounded" />
        <input name="guardianPhone" placeholder="Guardian Phone" value={form.guardianPhone} onChange={handleChange} className="border p-2 rounded" />
      </div>
      <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 rounded w-full" rows={3} />
      <div>
        {form.photoUrl && (
          <img
            src={form.photoUrl}
            alt="Preview"
            className="w-20 h-20 object-cover mb-2"
          />
        )}
        <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
        <button type="button" onClick={handlePhotoUpload} disabled={!photoFile || uploading} className="ml-2 bg-gray-300 px-3 py-1 rounded">
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </div>
      <button type="submit" disabled={saving} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  )
}