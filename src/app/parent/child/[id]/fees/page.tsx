import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ChildFeesClient from "./ChildFeesClient"

export default async function ChildFeesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "PARENT") redirect("/login")
  const { id } = await params

  const student = await prisma.student.findUnique({
    where: { id },
    select: { id: true, firstName: true, lastName: true, parentId: true, class: { select: { name: true } } },
  })
  if (!student || student.parentId !== session.user.id) notFound()

  const vouchers = await prisma.feeVoucher.findMany({
    where: { studentId: id },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 12,
  })

  return <ChildFeesClient student={student} vouchers={vouchers} />
}