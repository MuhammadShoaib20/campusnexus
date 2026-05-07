import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id, settings } = await req.json()
  if (!id || !settings) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  await prisma.campus.update({
    where: { id },
    data: { settings },
  })

  return NextResponse.json({ success: true })
}