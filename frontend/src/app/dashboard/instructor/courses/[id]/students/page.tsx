"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Users, Mail, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

const students = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", progress: 85, enrolledAt: "2024-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", progress: 62, enrolledAt: "2024-01-20" },
  { id: "3", name: "Carol White", email: "carol@example.com", progress: 45, enrolledAt: "2024-02-01" },
  { id: "4", name: "David Brown", email: "david@example.com", progress: 90, enrolledAt: "2024-01-10" },
]

export default function CourseStudentsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={[
          { label: "My Courses", href: "/dashboard/instructor/courses" },
          { label: "Students" },
        ]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enrolled Students</h1>
            <p className="text-zinc-500 mt-1">{students.length} students enrolled.</p>
          </div>
          <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Message All</Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input placeholder="Search students..." className="pl-10 rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} variant="elevated" className="p-5">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((student) => (
              <Card key={student.id} variant="elevated" className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-bg dark:bg-primary-bg-dark text-primary font-bold text-sm">
                    {student.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-zinc-500">{student.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Progress value={student.progress} className="flex-1" />
                      <span className="text-xs font-medium text-zinc-500">{student.progress}%</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-zinc-400 shrink-0">
                    <p>Enrolled</p>
                    <p>{student.enrolledAt}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
