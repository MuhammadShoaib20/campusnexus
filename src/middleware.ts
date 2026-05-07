import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // If no session, redirect to login
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = session.user.role

  // Parent routes
  if (pathname.startsWith("/parent") && role !== "PARENT") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Teacher routes
  if (pathname.startsWith("/teacher") && role !== "TEACHER") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Admin routes (Super Admin, Admin, Accountant)
  if (
    pathname.startsWith("/admin") &&
    !["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"].includes(role)
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/parent/:path*", "/teacher/:path*", "/admin/:path*"],
}