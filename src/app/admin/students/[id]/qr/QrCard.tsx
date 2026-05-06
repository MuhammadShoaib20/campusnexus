"use client"

import { QRCodeSVG } from "qrcode.react"

type Student = { id: string; firstName: string; lastName: string; class?: { name: string } | null }

export default function QrCard({ student }: { student: Student }) {
  const qrValue = JSON.stringify({ id: student.id, name: `${student.firstName} ${student.lastName}` })

  return (
    <div className="max-w-xs mx-auto mt-10 p-4 border rounded text-center">
      <h2 className="text-lg font-bold mb-2">Student ID Card</h2>
      <p>{student.firstName} {student.lastName}</p>
      {student.class && <p className="text-sm text-gray-600">{student.class.name}</p>}
      <div className="my-4">
        <QRCodeSVG value={qrValue} size={200} />
      </div>
      <p className="text-xs text-gray-500">Scan to record attendance</p>
      <button onClick={() => window.print()} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Print Card</button>
    </div>
  )
}