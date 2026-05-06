import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const { action } = await req.json()   // "APPROVED" or "REJECTED"

  if (!action || !["APPROVED", "REJECTED"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  const admission = await prisma.admission.findUnique({ where: { id } })
  if (!admission || admission.campusId !== session.user.campusId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (action === "APPROVED") {
    // Create Student record
    const student = await prisma.student.create({
      data: {
        campusId: admission.campusId,
        firstName: admission.firstName,
        lastName: admission.lastName,
        dateOfBirth: admission.dateOfBirth,
        gender: admission.gender,
        guardianName: admission.guardianName,
        guardianPhone: admission.guardianPhone,
        guardianEmail: admission.guardianEmail,
        address: admission.address,
        classId: null,   // class will be assigned later
      },
    })

    // Create Parent user if guardianEmail exists
    if (admission.guardianEmail) {
      const existingUser = await prisma.user.findUnique({
        where: { email: admission.guardianEmail },
      })

      if (!existingUser) {
        const randomPassword = Math.random().toString(36).slice(-10)
        const hashedPassword = await bcrypt.hash(randomPassword, 12)

        await prisma.user.create({
          data: {
            email: admission.guardianEmail,
            password: hashedPassword,
            name: admission.guardianName,
            role: "PARENT",
            campusId: admission.campusId,
          },
        })
        // TODO: send email with password (Phase 10)
      }
    }

    // Update admission status
    await prisma.admission.update({
      where: { id },
      data: { status: "APPROVED" },
    })

    return NextResponse.json({ student })
  }

  // Just update status for rejected
  await prisma.admission.update({
    where: { id },
    data: { status: "REJECTED" },
  })

  return NextResponse.json({ success: true })
}