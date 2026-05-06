import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'
import { IncomingForm, Fields, Files } from 'formidable'
import { Readable } from 'stream'
import { IncomingMessage } from 'http'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Helper to parse form-data from a NextRequest
async function parseForm(
  req: NextRequest
): Promise<{ fields: Fields; files: Files }> {
  const form = new IncomingForm()
  const body = await req.arrayBuffer()
  const buf = Buffer.from(body)
  const fakeReq = Readable.from(buf) as unknown as IncomingMessage
  fakeReq.headers = Object.fromEntries(req.headers.entries())

  return new Promise((resolve, reject) => {
    form.parse(fakeReq, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export async function POST(req: NextRequest) {
  // 🔐 Auth check (TASK KA MAIN PART)
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ⬇️ Neeche ka code bilkul same hai (unchanged)
  try {
    const { files } = await parseForm(req)

    const rawImage = files.image
    if (!rawImage) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const file = Array.isArray(rawImage) ? rawImage[0] : rawImage

    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'campusnexus',
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}