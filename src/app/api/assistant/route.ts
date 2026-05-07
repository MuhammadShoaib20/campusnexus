import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { message } = await req.json()
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 })

  const lower = message.toLowerCase()

  // --- Keyword matching ---
  if (
    lower.includes("defaulter") ||
    lower.includes("defaulters") ||
    lower.includes("unpaid fees")
  ) {
    return NextResponse.json({
      reply: "Opening the defaulter list...",
      redirect: "/admin/fees/defaulters",
    })
  }

  if (lower.includes("new admission") || lower.includes("admission form")) {
    return NextResponse.json({
      reply: "Opening the public admission form...",
      redirect: "/admission",
    })
  }

  if (
    lower.includes("fee voucher") ||
    lower.includes("fee vouchers") ||
    lower.includes("generate voucher")
  ) {
    return NextResponse.json({
      reply: "Opening the fee voucher management page...",
      redirect: "/admin/fees/vouchers",
    })
  }

  if (
    lower.includes("attendance report") ||
    lower.includes("daily report")
  ) {
    return NextResponse.json({
      reply: "Opening the attendance report...",
      redirect: "/admin/attendance/report",
    })
  }

  if (lower.includes("exam") || lower.includes("marks")) {
    return NextResponse.json({
      reply: "Opening the exam management...",
      redirect: "/admin/exams",
    })
  }

  if (lower.includes("student list") || lower.includes("students")) {
    return NextResponse.json({
      reply: "Opening the student list...",
      redirect: "/admin/students",
    })
  }

  // Fallback
  const suggestions = [
    "Show defaulter list",
    "New admission",
    "Fee vouchers",
    "Attendance report",
    "Exams and marks",
    "Student list",
  ]

  return NextResponse.json({
    reply: `I didn't understand. Try one of these: ${suggestions.join(", ")}`,
  })
}