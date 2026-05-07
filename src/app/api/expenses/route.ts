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
  if (month && year) {
    where.date = {
      gte: new Date(Number(year), Number(month) - 1, 1),
      lt: new Date(Number(year), Number(month), 1),
    }
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: "desc" },
  })
  return NextResponse.json(expenses)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const { description, amount, date } = await req.json()
  if (!description || amount == null || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const expense = await prisma.expense.create({
    data: { description, amount: Number(amount), date: new Date(date), campusId },
  })
  return NextResponse.json({ expense }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  await prisma.expense.deleteMany({ where: { id, campusId: session.user.campusId } })
  return NextResponse.json({ success: true })
}
