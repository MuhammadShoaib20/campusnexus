"use client"

type Voucher = { id: string; month: number; year: number; totalAmount: number; isPaid: boolean }

export default function ChildFeesClient({
  student,
  vouchers,
}: {
  student: { firstName: string; lastName: string }
  vouchers: Voucher[]
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Fee Status</h1>
      <p className="mb-4">{student.firstName} {student.lastName}</p>
      <table className="w-full border">
        <thead><tr className="bg-gray-100"><th className="p-2">Period</th><th className="p-2">Amount</th><th className="p-2">Status</th></tr></thead>
        <tbody>
          {vouchers.map(v => (
            <tr key={v.id} className="border-t">
              <td className="p-2">{v.month}/{v.year}</td>
              <td className="p-2">{v.totalAmount}</td>
              <td className="p-2">{v.isPaid ? "Paid" : "Unpaid"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}