"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AdminEditor from "./AdminEditor"

export default function AdminPages() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="p-6">Loading...</div>
  }

  if (!session?.user) {
    return null // will redirect in useEffect
  }

  return (
    <AdminEditor campusId={session.user.campusId} />
  )
}