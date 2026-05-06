import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import FeeStructureClient from "./FeeStructureClient"

export default async function FeeStructurePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const campusId = session.user.campusId
  const [classes, structures] = await Promise.all([
    prisma.class.findMany({ where: { campusId }, orderBy: { name: "asc" } }),
    prisma.feeStructure.findMany({ where: { campusId }, include: { class: true } }),
  ])

  return <FeeStructureClient classes={classes} structures={structures} />
}