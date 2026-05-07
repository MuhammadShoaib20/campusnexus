// src/app/api/teacher/classes/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const assignments = await prisma.teacherAssignment.findMany({
    where: { userId: session.user.id },
    include: { class: true },
  })

  return NextResponse.json(assignments.map(a => a.class))
}