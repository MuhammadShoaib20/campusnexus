import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import jsPDF from "jspdf"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ voucherId: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { voucherId } = await params
  const voucher = await prisma.feeVoucher.findUnique({
    where: { id: voucherId },
    include: {
      student: true,
      payments: true,
    },
  })
  if (!voucher || voucher.campusId !== session.user.campusId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text("Fee Receipt", 20, 20)
  doc.setFontSize(12)
  doc.text(`Student: ${voucher.student.firstName} ${voucher.student.lastName}`, 20, 30)
  doc.text(`Month/Year: ${voucher.month}/${voucher.year}`, 20, 37)
  doc.text(`Total Amount: ${voucher.totalAmount}`, 20, 44)
  doc.text(`Status: ${voucher.isPaid ? "Paid" : "Unpaid"}`, 20, 51)

  let y = 60
  if (voucher.payments.length > 0) {
    doc.text("Payments:", 20, y)
    y += 7
    voucher.payments.forEach((p, i) => {
      doc.text(
        `${i + 1}. ${p.amount} via ${p.method} on ${new Date(p.paidAt).toLocaleDateString()}`,
        25,
        y
      )
      y += 6
    })
  }

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"))
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=receipt_${voucherId}.pdf`,
    },
  })
}