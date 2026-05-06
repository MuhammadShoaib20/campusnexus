import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const student = await prisma.student.findUnique({
    where: { id },
    include: { class: true },
  })
  if (!student || student.campusId !== session.user.campusId)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(student)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  try {
    await prisma.student.updateMany({
      where: { id, campusId: session.user.campusId },
      data: body,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.student.deleteMany({
    where: { id, campusId: session.user.campusId },
  })
  return NextResponse.json({ success: true })
}