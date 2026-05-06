import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const date = req.nextUrl.searchParams.get("date")
  const classId = req.nextUrl.searchParams.get("classId")

  if (!date) {
    return NextResponse.json({ error: "Date required" }, { status: 400 })
  }

  const where: Record<string, unknown> = {
    campusId,
    date: new Date(date as string),
  }
  if (classId) {
    where.student = { classId }
  }

  const [total, present, absent, late] = await Promise.all([
    prisma.attendance.count({ where }),
    prisma.attendance.count({ where: { ...where, status: "PRESENT" } }),
    prisma.attendance.count({ where: { ...where, status: "ABSENT" } }),
    prisma.attendance.count({ where: { ...where, status: "LATE" } }),
  ])

  return NextResponse.json({ total, present, absent, late })
}