import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest) {
     void _req
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const campusId = session.user.campusId
  const structures = await prisma.feeStructure.findMany({
    where: { campusId },
    include: { class: true },
    orderBy: [{ class: { name: "asc" } }, { feeType: "asc" }],
  })
  return NextResponse.json(structures)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const { classId, feeType, amount } = await req.json()
  if (!classId || !feeType || amount == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  try {
    const structure = await prisma.feeStructure.create({
      data: { classId, feeType, amount, campusId },
    })
    return NextResponse.json({ structure }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.feeStructure.deleteMany({
    where: { id, campusId: session.user.campusId },
  })
  return NextResponse.json({ success: true })
}