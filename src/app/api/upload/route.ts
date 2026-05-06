import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  // 1. Authentication check
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // 2. Parse uploaded file from FormData
    const formData = await req.formData()
    const file = formData.get("image") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // 3. Convert file to buffer for Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 4. Upload to Cloudinary using upload_stream with unsigned upload
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { 
            folder: "campusnexus",
            unsigned: true,
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
          }, 
          (error, result) => {
            if (error) reject(error)
            else if (result) resolve(result)
            else reject(new Error("Unknown Cloudinary error"))
          }
        )
        .end(buffer)
    })

    // 5. Return the secure URL
    return NextResponse.json({ url: uploadResult.secure_url })
  } catch (error) {
    console.error("Upload error:", error)
    // For debugging – you can remove 'details' later
    return NextResponse.json(
      { error: "Upload failed", details: (error as Error).message },
      { status: 500 }
    )
  }
}