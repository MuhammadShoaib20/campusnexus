import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST() {
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const campus = await prisma.campus.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      name: "DEBS Main Campus",
      slug: "default",
      settings: {
        logoUrl: "",
        primaryColor: "#1e40af",
        address: "123 School Street, City",
        phone: "+92 300 1234567",
        email: "info@debs.edu.pk",
      },
    },
  })

  return NextResponse.json({ campus })
}