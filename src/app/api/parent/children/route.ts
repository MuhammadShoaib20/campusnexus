import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const children = await prisma.student.findMany({
    where: { parentId: session.user.id },
    include: { class: true },
  })

  return NextResponse.json(children)
}