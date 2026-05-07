import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const page = await prisma.page.findUnique({
    where: { slug: 'home' },
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
      <p className="mt-6 text-sm text-gray-500">Locale: {locale}</p>
    </main>
  )
}
