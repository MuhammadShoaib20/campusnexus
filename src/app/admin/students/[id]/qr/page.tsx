import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QrCard from "./QrCard";

export default async function StudentQrPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id }, include: { class: true } });
  if (!student || student.campusId !== session.user.campusId) notFound();
  return <QrCard student={student} />;
}