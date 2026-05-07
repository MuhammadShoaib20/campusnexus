"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function MockPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const paymentId = searchParams.get("paymentId")
  const voucherId = searchParams.get("voucherId")
  const amount = searchParams.get("amount")

  const handlePay = async () => {
    if (!paymentId || !voucherId || !amount) return
    setLoading(true)
    const res = await fetch("/api/payments/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId,
        voucherId,
        amount: parseFloat(amount),
      }),
    })
    if (res.ok) {
      alert("Payment successful!")
      router.push("/admin/fees/vouchers")
    } else {
      alert("Payment failed. Please try again.")
    }
    setLoading(false)
  }

  if (!paymentId || !voucherId || !amount) {
    return <div className="p-6 text-center text-red-500">Invalid payment link</div>
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Online Fee Payment (Mock)</h1>
      <p className="mb-2">Voucher: {voucherId}</p>
      <p className="mb-4">Amount: <strong>PKR {amount}</strong></p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm">Card Number</label>
          <input
            className="border p-2 w-full rounded"
            placeholder="1234 5678 9012 3456"
            disabled
            value="4111 1111 1111 1111"
          />
        </div>
        <div className="flex gap-2">
          <input className="border p-2 w-1/2 rounded" placeholder="MM/YY" disabled value="12/28" />
          <input className="border p-2 w-1/2 rounded" placeholder="CVV" disabled value="123" />
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  )
}