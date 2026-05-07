import { Suspense } from "react"
import MockPaymentClient from "./MockPaymentClient"

export const dynamic = "force-dynamic"

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading payment...</div>}>
      <MockPaymentClient />
    </Suspense>
  )
}
