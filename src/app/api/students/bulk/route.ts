import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campusId = session.user.campusId
  const body = await req.json()

  if (!Array.isArray(body)) return NextResponse.json({ error: "Invalid data" }, { status: 400 })

  // Clean up empty strings to null for optional fields
  const cleanedBody = body.map((student) => {
    const cleaned = { ...student }
    if (cleaned.photoUrl === "") cleaned.photoUrl = null
    if (cleaned.classId === "") cleaned.classId = null
    if (cleaned.gender === "") cleaned.gender = null
    if (cleaned.admissionNumber === "") cleaned.admissionNumber = null
    if (cleaned.rollNumber === "") cleaned.rollNumber = null
    if (cleaned.guardianName === "") cleaned.guardianName = null
    if (cleaned.guardianPhone === "") cleaned.guardianPhone = null
    if (cleaned.guardianEmail === "") cleaned.guardianEmail = null
    if (cleaned.address === "") cleaned.address = null
    // Convert dateOfBirth string to Date if provided
    if (cleaned.dateOfBirth && typeof cleaned.dateOfBirth === 'string') {
      cleaned.dateOfBirth = new Date(cleaned.dateOfBirth)
    }
    return cleaned
  })

  try {
    const created = await prisma.$transaction(
      cleanedBody.map((student) =>
        prisma.student.create({ data: { ...student, campusId } })
      )
    )
    return NextResponse.json({ count: created.length })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Bulk create failed" }, { status: 500 })
  }
}