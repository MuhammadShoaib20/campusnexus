import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import DOMPurify from 'isomorphic-dompurify'

export async function POST(req: NextRequest) {
  try {
    const { slug, title, content, campusId } = await req.json()
    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const cleanContent = DOMPurify.sanitize(content)

    const page = await prisma.page.upsert({
      where: { slug },
      update: { title, content: cleanContent, isPublished: true },
      create: { slug, title, content: cleanContent, campusId: campusId || 'default', isPublished: true },
    })

    return NextResponse.json({ page })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}