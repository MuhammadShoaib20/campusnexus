import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const { searchParams } = new URL(req.url)
  const classId = searchParams.get("classId")
  const search = searchParams.get("search")

  const where: Record<string, unknown> = { campusId }
  if (classId) where.classId = classId
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { admissionNumber: { contains: search, mode: "insensitive" } },
    ]
  }

  const students = await prisma.student.findMany({
    where,
    include: { class: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(students)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const body = await req.json()

  // Convert dateOfBirth string to Date object if provided
  if (body.dateOfBirth) {
    body.dateOfBirth = new Date(body.dateOfBirth)
  }

  // Optional: remove empty strings for fields that should be null
  if (body.photoUrl === "") body.photoUrl = null
  if (body.classId === "") body.classId = null
  if (body.gender === "") body.gender = null
  if (body.admissionNumber === "") body.admissionNumber = null
  if (body.rollNumber === "") body.rollNumber = null
  if (body.guardianName === "") body.guardianName = null
  if (body.guardianPhone === "") body.guardianPhone = null
  if (body.guardianEmail === "") body.guardianEmail = null
  if (body.address === "") body.address = null

  try {
    const student = await prisma.student.create({
      data: { ...body, campusId },
    })
    return NextResponse.json({ student }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}