import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { voucherId, amount, method } = await req.json()
  if (!voucherId || !amount) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  // Verify voucher belongs to campus
  const voucher = await prisma.feeVoucher.findUnique({ where: { id: voucherId } })
  if (!voucher || voucher.campusId !== session.user.campusId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Create payment
  const payment = await prisma.payment.create({
    data: {
      voucherId,
      amount,
      method: method || "Cash",
      campusId: session.user.campusId,
    },
  })

  // Check if total payments >= voucher total to mark as paid
  const totalPaid = await prisma.payment.aggregate({
    where: { voucherId },
    _sum: { amount: true },
  })
  const paidSoFar = totalPaid._sum.amount || 0
  if (paidSoFar >= voucher.totalAmount) {
    await prisma.feeVoucher.update({
      where: { id: voucherId },
      data: { isPaid: true },
    })
  }

  return NextResponse.json({ payment }, { status: 201 })
}