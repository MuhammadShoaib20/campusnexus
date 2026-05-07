import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const campusId = session.user.campusId
  const month = Number(req.nextUrl.searchParams.get("month")) || new Date().getMonth() + 1
  const year = Number(req.nextUrl.searchParams.get("year")) || new Date().getFullYear()

  const feeCollection = await prisma.feeVoucher.aggregate({
    where: { campusId, isPaid: true, month, year },
    _sum: { totalAmount: true },
  })

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)
  const totalExpenses = await prisma.expense.aggregate({
    where: {
      campusId,
      date: { gte: startDate, lt: endDate },
    },
    _sum: { amount: true },
  })

  const totalSalaries = await prisma.salary.aggregate({
    where: { campusId, month, year },
    _sum: { amount: true },
  })

  const income = feeCollection._sum.totalAmount || 0
  const expenses = totalExpenses._sum.amount || 0
  const salaries = totalSalaries._sum.amount || 0
  const net = income - expenses - salaries

  return NextResponse.json({ month, year, income, expenses, salaries, net })
}
