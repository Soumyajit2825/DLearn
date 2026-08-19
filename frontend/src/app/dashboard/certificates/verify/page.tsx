"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Search, CheckCircle, XCircle, ArrowLeft, Award, ExternalLink } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function VerifyCertificatePage() {
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
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/certificates">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Verify Certificate</h1>
            <p className="text-zinc-500 text-sm">Check the authenticity of a blockchain certificate.</p>
          </div>
        </div>

        <Card variant="elevated" className="p-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input
                placeholder="Enter certificate hash..."
                className="pl-11 h-14 text-sm font-mono"
                value={hash}
                onChange={(e) => { setHash(e.target.value); setResult(null) }}
              />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={verifying} disabled={!hash.trim()}>
              <Search className="mr-2 h-4 w-4" /> Verify
            </Button>
          </form>
        </Card>

        {result === "valid" && (
          <Card variant="elevated" className="p-6 border-emerald-200 dark:border-emerald-800">
            <div className="text-center mb-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">Valid Certificate</h2>
              <p className="text-sm text-zinc-500">This certificate is authentic and verified on the blockchain.</p>
            </div>
            <Separator className="my-4" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Holder</span><span className="font-medium">John Doe</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Course</span><span className="font-medium">Blockchain Fundamentals</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Issued</span><span className="font-medium">March 15, 2024</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Issuer</span><span className="font-medium">DLearn Platform</span></div>
              <div>
                <span className="text-zinc-500 text-xs block mb-1">Hash</span>
                <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 break-all">{hash}</span>
              </div>
            </div>
          </Card>
        )}

        {result === "invalid" && (
          <Card variant="elevated" className="p-6 border-red-200 dark:border-red-800">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950 mb-4">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-red-700 dark:text-red-300">Invalid Certificate</h2>
              <p className="text-sm text-zinc-500 mt-2">
                No certificate found with this hash. The hash may be incorrect or the certificate has been revoked.
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
