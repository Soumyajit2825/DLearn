"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, BookOpen, Clock, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import api from "@/lib/api"
import type { Enrollment } from "@/types"

interface CourseDisplay {
  id: string
  title: string
  instructor: string
  progress: number
  category: string
  level: string
  image: null
}

export default function CoursesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<CourseDisplay[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get<Enrollment[]>("/enrollments/my")
        setEnrolledCourses(
          (res ?? []).map((e) => ({
            id: e.course?.id ?? e.course_id,
            title: e.course?.title ?? "Unknown Course",
            instructor: e.course?.instructor?.full_name ?? "Unknown",
            progress: e.progress ?? 0,
            category: e.course?.category ?? "General",
            level: e.course?.level ?? "beginner",
            image: null,
          }))
        )
      } catch (err: any) {
        setError(err.message ?? "Failed to load enrollments")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filtered = enrolledCourses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-zinc-500 mt-1">Continue your learning journey.</p>
          </div>
          <Link href="/dashboard/marketplace">
            <Button>Browse Marketplace</Button>
          </Link>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search courses..."
              className="pl-10 rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
        </div>

        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} variant="elevated" className="p-0 overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-zinc-500 mb-6">
              {search ? "No courses match your search." : "You haven't enrolled in any courses yet."}
            </p>
            {!search && (
              <Link href="/dashboard/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
                <Card variant="elevated" className="p-0 overflow-hidden hover:shadow-md transition-all group">
                  <div className="h-40 bg-gradient-to-br from-primary to-primary-active flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white/30" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{course.level}</Badge>
                      <Badge variant="blue">{course.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{course.instructor}</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-zinc-500">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
