"use client"

import { useEffect, useState, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { useSession } from "next-auth/react"

export default function ScanAttendancePage() {
  const { data: session } = useSession()
  const [message, setMessage] = useState("")
  const [cameraReady, setCameraReady] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    if (!session) return

    const scanner = new Html5Qrcode("reader")
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          // Successfully scanned a QR
          try {
            await scanner.stop()
          } catch {
            // ignore any stop errors
          }
          setCameraReady(false)

          try {
            const parsed = JSON.parse(decodedText) as { id: string; name?: string }
            if (!parsed.id) throw new Error("Invalid QR")

            const today = new Date().toISOString().slice(0, 10)
            const res = await fetch("/api/attendance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                records: [{ studentId: parsed.id, date: today, status: "PRESENT", method: "QR" }],
              }),
            })

            if (res.ok) {
              setMessage(`✅ Marked present: ${parsed.name || parsed.id}`)
            } else {
              setMessage("❌ Failed to mark attendance")
            }
          } catch {
            setMessage("❌ Invalid QR code")
          }

          // Restart scanning after 2 seconds
          setTimeout(async () => {
            try {
              await scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                () => {}, // on scan success (unused because we stop on first scan)
                () => {}
              )
              setCameraReady(true)
            } catch (err) {
              console.error(err)
              setErrorMsg("Cannot restart camera")
            }
          }, 2000)
        },
        () => {
          // on scan failure (e.g., no QR in view) – no action needed
        }
      )
      .then(() => {
        setCameraReady(true)
      })
      .catch((err) => {
        console.error("Camera error:", err)
        setErrorMsg("❌ Camera not available or permission denied. Please use a device with a camera.")
      })

    return () => {
      // Cleanup: only stop if scanner is running
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            scannerRef.current = null
          })
      }
    }
  }, [session])

  if (!session) return null

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">QR Attendance Scanner</h1>

      {!cameraReady && !errorMsg && (
        <div className="mb-4 text-gray-600">Starting camera...</div>
      )}

      <div id="reader" style={{ width: "100%", maxWidth: "400px" }} />

      {errorMsg && (
        <div className="mt-4 p-2 bg-red-50 border border-red-300 rounded text-red-700">
          {errorMsg}
        </div>
      )}

      {message && (
        <div className="mt-4 p-2 border rounded bg-white text-lg font-medium">
          {message}
        </div>
      )}
    </div>
  )
}