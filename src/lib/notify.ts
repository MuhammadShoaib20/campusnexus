import { prisma } from "@/lib/prisma"

export async function createNotification({
  campusId,
  message,
  type = "INFO",
}: {
  campusId: string
  message: string
  type?: string
}) {
  try {
    await prisma.notification.create({
      data: {
        campusId,
        message,
        type,
      },
    })
  } catch (error) {
    console.error("Failed to create notification:", error)
  }
}
