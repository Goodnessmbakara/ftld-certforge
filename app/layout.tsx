import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FTLD CertForge - Certificate Generation & Verification",
  description: "Generate and verify certificates for FTLD programs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <div className="min-h-screen bg-black bg-opacity-95 bg-[url('/pattern-bg.png')] bg-repeat">{children}</div>
      </body>
    </html>
  )
}
