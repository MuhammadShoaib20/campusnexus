import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const month = req.nextUrl.searchParams.get("month")
  const year = req.nextUrl.searchParams.get("year")
  const studentId = req.nextUrl.searchParams.get("studentId")

  const where: Record<string, unknown> = { campusId }
  if (month) where.month = parseInt(month)
  if (year) where.year = parseInt(year)
  if (studentId) where.studentId = studentId

  const vouchers = await prisma.feeVoucher.findMany({
    where,
    include: { student: true, payments: true },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  })
  return NextResponse.json(vouchers)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const campusId = session.user.campusId
  const { month, year, classId } = await req.json()
  if (!month || !year) {
    return NextResponse.json({ error: "Month and Year required" }, { status: 400 })
  }

  const studentWhere: Record<string, unknown> = { campusId }
  if (classId) studentWhere.classId = classId

  const students = await prisma.student.findMany({
    where: studentWhere,
    include: { class: true },
  })

  if (students.length === 0) {
    return NextResponse.json({ error: "No students found" }, { status: 400 })
  }

  let created = 0
  for (const student of students) {
    // Check if voucher already exists for this student+month+year
    const existing = await prisma.feeVoucher.findUnique({
      where: {
        campusId_studentId_month_year: {
          campusId,
          studentId: student.id,
          month,
          year,
        },
      },
    })
    if (existing) continue

    // Calculate total amount for this student based on class fee structures
    const structures = await prisma.feeStructure.findMany({
      where: { campusId, classId: student.classId! },
    })
    if (!student.classId) continue

    const totalAmount = structures.reduce((sum, s) => sum + s.amount, 0)

    await prisma.feeVoucher.create({
      data: {
        campusId,
        studentId: student.id,
        month: parseInt(month),
        year: parseInt(year),
        totalAmount,
      },
    })
    created++
  }

  return NextResponse.json({ created })
}