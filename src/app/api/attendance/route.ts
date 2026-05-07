import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendWhatsAppMessage } from "@/lib/twilio"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const date = req.nextUrl.searchParams.get("date")
  const classId = req.nextUrl.searchParams.get("classId")

  const where: Record<string, unknown> = { campusId }
  if (date) {
    where.date = new Date(date as string)
  }
  if (classId) {
    where.student = { classId }
  }

  try {
    const records = await prisma.attendance.findMany({
      where,
      include: { student: { include: { class: true } } },
      orderBy: { student: { firstName: "asc" } },
    })
    return NextResponse.json(records)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const { records } = await req.json()   // expects array of { studentId, date, status, method }

  if (!records || !Array.isArray(records)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  try {
    for (const record of records) {
      await prisma.attendance.upsert({
        where: {
          campusId_studentId_date: {
            campusId,
            studentId: record.studentId,
            date: new Date(record.date),
          },
        },
        update: { status: record.status, method: record.method || "MANUAL", recordedBy: session.user.id },
        create: {
          campusId,
          studentId: record.studentId,
          date: new Date(record.date),
          status: record.status,
          method: record.method || "MANUAL",
          recordedBy: session.user.id,
        },
      })
    }

    // Send WhatsApp notifications for absent students
    const absentRecords = records.filter((r: { studentId: string; date: string; status: string }) => r.status === "ABSENT")
    for (const record of absentRecords) {
      const student = await prisma.student.findUnique({
        where: { id: record.studentId },
        select: { firstName: true, guardianPhone: true },
      })
      if (student?.guardianPhone) {
        await sendWhatsAppMessage(
          student.guardianPhone,
          `${student.firstName} was marked absent today (${new Date(record.date).toLocaleDateString()}). Please contact the school if this is unexpected. - DEBS`
        )
      }
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 })
  }
}