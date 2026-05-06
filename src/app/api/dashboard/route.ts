import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId

  const [totalStudents, todayAttendance, feeCollected, recentAdmissions] = await Promise.all([
    prisma.student.count({ where: { campusId } }),
    0, // placeholder for attendance (Phase 7)
    0, // placeholder for fee collection (Phase 6)
    prisma.student.findMany({ where: { campusId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ])

  return NextResponse.json({
    totalStudents,
    todayAttendance,
    feeCollected,
    recentAdmissions,
  })
}