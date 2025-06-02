import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthErrorBoundary } from "@/components/auth/auth-error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Circuit Breaker - Electronics Club",
  description: "A community of electronics enthusiasts building the future together",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthErrorBoundary>{children}</AuthErrorBoundary>
      </body>
    </html>
  )
}
