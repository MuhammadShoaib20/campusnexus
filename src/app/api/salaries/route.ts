import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const campusId = session.user.campusId
  const month = req.nextUrl.searchParams.get("month")
  const year = req.nextUrl.searchParams.get("year")

  const where: Record<string, unknown> = { campusId }
  if (month) where.month = Number(month)
  if (year) where.year = Number(year)

  const salaries = await prisma.salary.findMany({
    where,
    include: { user: { select: { name: true, email: true } } },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  })
  return NextResponse.json(salaries)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const { userId, amount, month, year } = await req.json()
  if (!userId || amount == null || !month || !year) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const salary = await prisma.salary.create({
    data: { userId, amount: Number(amount), month: Number(month), year: Number(year), campusId },
  })
  return NextResponse.json({ salary }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  await prisma.salary.deleteMany({ where: { id, campusId: session.user.campusId } })
  return NextResponse.json({ success: true })
}
