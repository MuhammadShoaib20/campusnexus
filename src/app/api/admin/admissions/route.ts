import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const campusId = session.user.campusId
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const where: Record<string, unknown> = { campusId }
  if (status) where.status = status

  const admissions = await prisma.admission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(admissions)
}