import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BuilderClient from "@/app/admin/pages/builder/[slug]/BuilderClient"

export default async function PageBuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await auth()
  if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
    redirect("/login")
  }

  const { slug } = await params
  const page = await prisma.page.findUnique({ where: { slug } })

  if (!page) {
    return (
      <div className="p-6">
        <p>Page not found. Create it first via the page editor.</p>
      </div>
    )
  }

  return <BuilderClient page={page} />
}
