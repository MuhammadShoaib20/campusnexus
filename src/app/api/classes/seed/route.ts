import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST() {
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const classes = ["Nursery", "Prep", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]
  const campusId = session.user.campusId

  for (const name of classes) {
    await prisma.class.upsert({
      where: { campusId_name: { campusId, name } },
      update: {},
      create: { name, campusId },
    })
  }

  return NextResponse.json({ success: true })
}