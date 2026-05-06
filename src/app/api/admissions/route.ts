import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, dateOfBirth, gender, desiredClass, guardianName, guardianPhone, guardianEmail, address } = body

    if (!firstName || !lastName || !guardianName || !guardianPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const admission = await prisma.admission.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        desiredClass: desiredClass || null,
        guardianName,
        guardianPhone,
        guardianEmail: guardianEmail || null,
        address: address || null,
        campusId: "default",   // will be dynamic later
      },
    })

    return NextResponse.json({ admission }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}