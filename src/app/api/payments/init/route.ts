import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { voucherId } = await req.json()
  if (!voucherId) return NextResponse.json({ error: "Missing voucherId" }, { status: 400 })

  // Verify voucher belongs to campus
  const voucher = await prisma.feeVoucher.findUnique({
    where: { id: voucherId },
  })
  if (!voucher || voucher.campusId !== session.user.campusId) {
    return NextResponse.json({ error: "Voucher not found" }, { status: 404 })
  }

  // Create a pending payment (amount will be set on completion)
  const payment = await prisma.payment.create({
    data: {
      voucherId,
      amount: 0, // placeholder
      method: "Online",
      campusId: session.user.campusId,
    },
  })

  const redirectUrl = `/payment/mock?paymentId=${payment.id}&voucherId=${voucherId}&amount=${voucher.totalAmount}`

  return NextResponse.json({ redirectUrl })
}