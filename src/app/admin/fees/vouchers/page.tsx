"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

type Voucher = {
  id: string
  student: { firstName: string; lastName: string }
  month: number
  year: number
  totalAmount: number
  isPaid: boolean
  payments: { amount: number; method: string; paidAt: string }[]
}

type ClassItem = { id: string; name: string }

export default function VouchersPage() {
  const { data: session } = useSession()
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [classId, setClassId] = useState("")
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [paymentAmount, setPaymentAmount] = useState<Record<string, string>>({})
  const [showPayment, setShowPayment] = useState<string | null>(null)

  // Fetch classes once
  useEffect(() => {
    if (!session) return
    fetch("/api/classes")
      .then((res) => res.json())
      .then(setClasses)
      .catch(console.error)
  }, [session])

  // Refresh vouchers when month/year change – no warning
  useEffect(() => {
    let cancelled = false
    async function loadVouchers() {
      if (!session) return
      const params = new URLSearchParams()
      params.set("month", month.toString())
      params.set("year", year.toString())
      const res = await fetch(`/api/fees/vouchers?${params}`)
      if (!res.ok) return
      const data = await res.json()
      if (!cancelled) setVouchers(data)
    }
    loadVouchers()
    return () => { cancelled = true }
  }, [month, year, session])

  const handleGenerate = async () => {
    if (!month || !year) return alert("Select month and year")
    const res = await fetch("/api/fees/vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month,
        year,
        classId: classId || undefined,
      }),
    })
    const data = await res.json()
    if (data.created !== undefined) {
      alert(`Generated ${data.created} vouchers`)
      // Manually reload the list
      const params = new URLSearchParams()
      params.set("month", month.toString())
      params.set("year", year.toString())
      const r = await fetch(`/api/fees/vouchers?${params}`)
      const newData = await r.json()
      setVouchers(newData)
    } else {
      alert(data.error || "Error generating vouchers")
    }
  }

  const handlePayment = async (voucherId: string) => {
    const amount = paymentAmount[voucherId]
    if (!amount || parseFloat(amount) <= 0) return alert("Enter valid amount")
    const res = await fetch("/api/fees/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voucherId,
        amount: parseFloat(amount),
        method: "Cash",
      }),
    })
    if (res.ok) {
      setShowPayment(null)
      setPaymentAmount((prev) => ({ ...prev, [voucherId]: "" }))
      // Reload vouchers
      const params = new URLSearchParams()
      params.set("month", month.toString())
      params.set("year", year.toString())
      const r = await fetch(`/api/fees/vouchers?${params}`)
      const newData = await r.json()
      setVouchers(newData)
    } else {
      alert("Payment failed")
    }
  }

  if (!session) return null

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fee Vouchers</h1>

      <div className="flex flex-wrap gap-2 mb-4 items-end">
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="border p-2 rounded"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border p-2 rounded w-24"
        />
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Generate Vouchers
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Student</th>
            <th className="p-2 text-left">Month/Year</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No vouchers found for this period.
              </td>
            </tr>
          )}
          {vouchers.map((v) => (
            <tr key={v.id} className="border-t">
              <td className="p-2">
                {v.student.firstName} {v.student.lastName}
              </td>
              <td className="p-2">
                {v.month}/{v.year}
              </td>
              <td className="p-2">{v.totalAmount}</td>
              <td className="p-2">
                {v.isPaid ? (
                  <span className="text-green-600 font-medium">Paid</span>
                ) : (
                  <span className="text-red-600 font-medium">Unpaid</span>
                )}
              </td>
              <td className="p-2">
                <div className="flex gap-2 items-center">
                  {!v.isPaid && (
                    <button
                      onClick={() => setShowPayment(v.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Record Payment
                    </button>
                  )}
                  <a
                    href={`/api/fees/receipt/${v.id}`}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Receipt PDF
                  </a>
                </div>
                {showPayment === v.id && (
                  <div className="mt-2 flex gap-1">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={paymentAmount[v.id] || ""}
                      onChange={(e) =>
                        setPaymentAmount((prev) => ({
                          ...prev,
                          [v.id]: e.target.value,
                        }))
                      }
                      className="border p-1 w-24 rounded"
                    />
                    <button
                      onClick={() => handlePayment(v.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => setShowPayment(null)}
                      className="text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}