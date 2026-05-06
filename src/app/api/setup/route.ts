import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  // Prevent re‑run after first user exists
  const adminCount = await prisma.user.count()
  if (adminCount > 0) {
    return NextResponse.json(
      { error: "Setup already completed" },
      { status: 400 }
    )
  }

  const { email, password, name } = await req.json()
  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role: "SUPER_ADMIN",
      campusId: "default",          // can be changed later
    },
  })

  return NextResponse.json({ user: { id: user.id, email: user.email } })
}