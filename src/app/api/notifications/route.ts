import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const unreadOnly = req.nextUrl.searchParams.get("unread") === "true"
  const where: Record<string, unknown> = { campusId: session.user.campusId }
  if (unreadOnly) where.read = false

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json(notifications)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { message, type } = await req.json()
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 })

  const notification = await prisma.notification.create({
    data: {
      campusId: session.user.campusId,
      message,
      type: type || "INFO",
    },
  })

  return NextResponse.json({ notification }, { status: 201 })
}
