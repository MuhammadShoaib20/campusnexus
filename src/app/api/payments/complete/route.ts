import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { paymentId, voucherId, amount } = await req.json()
  if (!paymentId || !voucherId || !amount) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  try {
    // Update the payment amount
    await prisma.payment.update({
      where: { id: paymentId },
      data: { amount: parseFloat(amount) },
    })

    // Check if voucher is fully paid
    const voucher = await prisma.feeVoucher.findUnique({
      where: { id: voucherId },
      include: { payments: true },
    })
    if (!voucher) return NextResponse.json({ error: "Voucher not found" }, { status: 404 })

    const totalPaid = voucher.payments.reduce((sum, p) => sum + p.amount, 0)
    if (totalPaid >= voucher.totalAmount) {
      await prisma.feeVoucher.update({
        where: { id: voucherId },
        data: { isPaid: true },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Payment completion failed" }, { status: 500 })
  }
}