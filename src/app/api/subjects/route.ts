import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest) {
  void _req
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const campusId = session.user.campusId

  const subjects = await prisma.subject.findMany({
    where: { campusId },
    orderBy: { name: "asc" },
  })
  return NextResponse.json(subjects)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { name, code } = await req.json()
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 })
  try {
    const subject = await prisma.subject.create({
      data: { name, code, campusId: session.user.campusId },
    })
    return NextResponse.json({ subject }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  await prisma.subject.deleteMany({
    where: { id, campusId: session.user.campusId },
  })
  return NextResponse.json({ success: true })
}