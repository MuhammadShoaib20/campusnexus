import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const campusId = session.user.campusId
  const month = req.nextUrl.searchParams.get("month")
  const year = req.nextUrl.searchParams.get("year")

  const where: Record<string, unknown> = { campusId, isPaid: false }
  if (month) where.month = parseInt(month)
  if (year) where.year = parseInt(year)

  const defaulters = await prisma.feeVoucher.findMany({
    where,
    include: { student: true },
    orderBy: [{ year: "asc" }, { month: "asc" }],
  })
  return NextResponse.json(defaulters)
}