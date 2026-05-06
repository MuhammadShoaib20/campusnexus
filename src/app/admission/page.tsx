"use client"

import { useState } from "react"

export default function AdmissionForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    desiredClass: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    address: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const res = await fetch("/api/admissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json()
      setError(data.error || "Failed to submit")
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-20 p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
        <p>Your admission form has been received. We will contact you soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Online Admission Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="border p-2 rounded" required />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="border p-2 rounded" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="border p-2 rounded" />
          <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <input name="desiredClass" placeholder="Class applying for (e.g., Class 1)" value={form.desiredClass} onChange={handleChange} className="border p-2 rounded w-full" />
        <h2 className="font-semibold mt-4">Guardian Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="guardianName" placeholder="Guardian Name" value={form.guardianName} onChange={handleChange} className="border p-2 rounded" required />
          <input name="guardianPhone" placeholder="Guardian Phone" value={form.guardianPhone} onChange={handleChange} className="border p-2 rounded" required />
        </div>
        <input name="guardianEmail" type="email" placeholder="Guardian Email (optional)" value={form.guardianEmail} onChange={handleChange} className="border p-2 rounded w-full" />
        <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 rounded w-full" rows={2} />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full">
          Submit Application
        </button>
      </form>
    </div>
  )
}