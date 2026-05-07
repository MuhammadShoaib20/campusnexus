import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>   // <-- params is now a Promise
}) {
  const { slug } = await params       // <-- await it

  const page = await prisma.page.findUnique({
    where: { slug },
  })

  if (!page || !page.isPublished) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </main>
  )
}
