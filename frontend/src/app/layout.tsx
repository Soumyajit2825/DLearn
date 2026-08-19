import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "DLearn - Decentralized Learning Platform",
  description: "Learn, earn, and verify your skills on the blockchain. A decentralized education platform powered by Stellar.",
  keywords: ["decentralized learning", "blockchain education", "online courses", "Stellar", "certificates"],
  openGraph: {
    title: "DLearn - Decentralized Learning Platform",
    description: "Learn, earn, and verify your skills on the blockchain.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
