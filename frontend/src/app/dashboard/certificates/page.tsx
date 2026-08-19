"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Award, ExternalLink, Search, Shield } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

const certificates = [
  { id: "1", courseName: "React Mastery", issuedAt: "2024-03-15", hash: "0x7a3f...b9d2", verified: true },
  { id: "2", courseName: "Blockchain Fundamentals", issuedAt: "2024-02-20", hash: "0x4e1c...f8a7", verified: true },
  { id: "3", courseName: "JavaScript Basics", issuedAt: "2024-01-10", hash: "0x9b2d...e3c1", verified: true },
]

export default function CertificatesPage() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const filtered = certificates.filter((c) =>
    c.courseName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
            <p className="text-zinc-500 mt-1">Your blockchain-verified credentials.</p>
          </div>
          <Link href="/dashboard/certificates/verify">
            <Button variant="outline"><Shield className="mr-2 h-4 w-4" /> Verify Certificate</Button>
          </Link>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input placeholder="Search certificates..." className="pl-10 rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} variant="elevated" className="p-6">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Award className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
            <p className="text-zinc-500 mb-6">Complete courses to earn blockchain-verified certificates.</p>
            <Link href="/dashboard/marketplace">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cert) => (
              <Card key={cert.id} variant="elevated" className="p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
                    <Award className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{cert.courseName}</h3>
                    <p className="text-xs text-zinc-500">Issued {cert.issuedAt}</p>
                  </div>
                  {cert.verified && <Badge variant="success">Verified</Badge>}
                </div>
                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-3 text-xs">
                  <p className="text-zinc-500 mb-1">Certificate Hash</p>
                  <p className="font-mono text-zinc-700 dark:text-zinc-300 truncate">{cert.hash}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">Share</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
