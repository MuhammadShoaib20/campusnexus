import Providers from "./providers"
import ServiceWorkerRegistry from "@/components/ServiceWorkerRegistry"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body>
        <Providers>
          {children}
          <ServiceWorkerRegistry />
        </Providers>
      </body>
    </html>
  )
}