"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Search, CheckCircle, XCircle, GraduationCap, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function PublicVerifyPage() {
  const [hash, setHash] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<"valid" | "invalid" | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hash.trim()) return
    setVerifying(true)
    setResult(null)
    await new Promise((r) => setTimeout(r, 2000))
    setResult(hash.length > 10 ? "valid" : "invalid")
    setVerifying(false)
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      <header className="border-b border-hairline bg-canvas">
        <div className="container-main py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <GraduationCap className="h-4 w-4 text-on-primary" />
            </div>
            <span className="text-lg font-semibold text-ink">DLearn</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">Back to home</Button>
          </Link>
        </div>
      </header>

      <main className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-bg">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-normal tracking-tight text-ink mb-4 leading-tight">
            Certificate Verification
          </h1>
          <p className="text-muted mb-10 max-w-lg mx-auto">
            Verify the authenticity of a DLearn certificate by entering its unique blockchain hash.
          </p>

          <Card variant="elevated" className="p-8 mb-8">
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-soft" />
                <Input
                  placeholder="Enter certificate hash"
                  className="pl-12 h-14 text-sm font-mono"
                  value={hash}
                  onChange={(e) => { setHash(e.target.value); setResult(null) }}
                />
              </div>
              <Button type="submit" className="w-full" size="lg" loading={verifying} disabled={!hash.trim()}>
                <Search className="mr-2 h-4 w-4" /> Verify Certificate
              </Button>
            </form>
          </Card>

          {result === "valid" && (
            <Card variant="elevated" className="p-8 border-semantic-up/30 animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f7ed] shrink-0">
                  <CheckCircle className="h-7 w-7 text-semantic-up" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-semantic-up">Valid Certificate</h2>
                  <p className="text-sm text-muted">This certificate is authentic and verified on the Stellar blockchain.</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-bg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-ink">Blockchain Fundamentals</p>
                    <p className="text-muted">Issued to John Doe</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-surface-soft rounded-xl p-4">
                  <div>
                    <p className="text-muted text-xs">Issued by</p>
                    <p className="font-medium text-ink">DLearn Platform</p>
                  </div>
                  <div>
                    <p className="text-muted text-xs">Issued on</p>
                    <p className="font-medium text-ink">March 15, 2024</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted text-xs">Certificate Hash</p>
                    <p className="font-mono text-xs break-all mt-0.5 text-ink">{hash}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {result === "invalid" && (
            <Card variant="elevated" className="p-8 border-semantic-down/30 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fde8ea] shrink-0">
                  <XCircle className="h-7 w-7 text-semantic-down" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-semantic-down">Invalid Certificate</h2>
                  <p className="text-sm text-muted mt-1">
                    No certificate found with this hash. The certificate may not exist or has been revoked.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <p className="text-xs text-muted-soft mt-8">
            Powered by Stellar blockchain. All certificates are tamper-proof and publicly verifiable.
          </p>
        </div>
      </main>
    </div>
  )
}
