import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = req.nextUrl

  if (!token || !token.role) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = token.role as string

  if (pathname.startsWith("/parent") && role !== "PARENT") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/teacher") && role !== "TEACHER") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (
    pathname.startsWith("/admin") &&
    !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(role)
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/parent/:path*", "/teacher/:path*", "/admin/:path*"],
}