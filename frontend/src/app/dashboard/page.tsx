"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Award, Clock, Calendar, ArrowRight, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import api from "@/lib/api"
import { useAuth } from "@/providers/auth-provider"
import type { Enrollment } from "@/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState([
    { label: "Enrolled Courses", value: "0", icon: BookOpen, change: "0 this month" },
    { label: "Certificates Earned", value: "0", icon: Award, change: "0 this month" },
    { label: "Hours Learned", value: "0", icon: Clock, change: "0h this week" },
    { label: "Upcoming Deadlines", value: "0", icon: Calendar, change: "None" },
  ])
  const [recentActivity, setRecentActivity] = useState<{ type: string; text: string; time: string }[]>([])
  const [courseProgress, setCourseProgress] = useState<{ name: string; progress: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = user?.role === "instructor" ? "instructor" : "student"
        const [analyticsRes, enrollmentsRes] = await Promise.all([
          api.get<any>(`/analytics/${role}`),
          api.get<Enrollment[]>("/enrollments/my"),
        ])

        setStats([
          { label: "Enrolled Courses", value: String(analyticsRes.enrolledCourses ?? 0), icon: BookOpen, change: `+${analyticsRes.newCourses ?? 0} this month` },
          { label: "Certificates Earned", value: String(analyticsRes.certificatesEarned ?? 0), icon: Award, change: `+${analyticsRes.newCertificates ?? 0} this month` },
          { label: "Hours Learned", value: String(analyticsRes.hoursLearned ?? 0), icon: Clock, change: `${analyticsRes.weeklyHours ?? 0}h this week` },
          { label: "Upcoming Deadlines", value: String(analyticsRes.upcomingDeadlines ?? 0), icon: Calendar, change: analyticsRes.nextDeadline ? `Next: ${analyticsRes.nextDeadline}` : "None" },
        ])

        setRecentActivity(analyticsRes.recentActivity ?? [])

        setCourseProgress(
          (enrollmentsRes ?? []).map((e) => ({
            name: e.course?.title ?? "Unknown Course",
            progress: e.progress ?? 0,
          }))
        )
      } catch (err: any) {
        setError(err.message ?? "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">Dashboard</h1>
            <p className="text-muted mt-1">Welcome back, continue your learning journey.</p>
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Dashboard</h1>
          <p className="text-muted mt-1">Welcome back, continue your learning journey.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="elevated" className="p-6">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted">{stat.label}</p>
                    <p className="text-3xl font-semibold text-ink mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-soft mt-1">{stat.change}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-strong text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card variant="elevated" className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Course Progress</CardTitle>
                <Link href="/dashboard/courses">
                  <Button variant="ghost" size="sm">View all <ArrowRight className="ml-1 h-3 w-3" /></Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-5">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))
              ) : courseProgress.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-soft">No courses enrolled yet.</p>
                  <Link href="/dashboard/marketplace">
                    <Button variant="outline" size="sm" className="mt-3">Browse Courses</Button>
                  </Link>
                </div>
              ) : (
                courseProgress.map((course) => (
                  <div key={course.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-ink">{course.name}</span>
                      <span className="text-muted">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card variant="elevated" className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <Link href="/dashboard/notifications">
                  <Button variant="ghost" size="sm">View all <ArrowRight className="ml-1 h-3 w-3" /></Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-soft">No recent activity.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-strong">
                        <TrendingUp className="h-4 w-4 text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-body">{item.text}</p>
                        <p className="text-xs text-muted-soft mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card variant="elevated" className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/marketplace"><Button variant="outline">Browse Courses</Button></Link>
              <Link href="/dashboard/courses"><Button variant="outline">Continue Learning</Button></Link>
              <Link href="/dashboard/certificates"><Button variant="outline">My Certificates</Button></Link>
              <Link href="/dashboard/discussions"><Button variant="outline">Join Discussion</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
