"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Clock, Award, BookOpen, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import api from "@/lib/api"

interface AnalyticsData {
  totalHours: number
  completedCourses: number
  quizAvgScore: number
  streakDays: number
  weeklyData: { day: string; hours: number }[]
  monthlyData: { month: string; hours: number }[]
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalHours: 0,
    completedCourses: 0,
    quizAvgScore: 0,
    streakDays: 0,
    weeklyData: [],
    monthlyData: [],
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const role = user?.role === "instructor" ? "instructor" : "student"
        const res = await api.get<any>(`/analytics/${role}`)
        setAnalyticsData({
          totalHours: res.totalHours ?? res.hoursLearned ?? 0,
          completedCourses: res.completedCourses ?? 0,
          quizAvgScore: res.quizAvgScore ?? 0,
          streakDays: res.streakDays ?? 0,
          weeklyData: res.weeklyData ?? [],
          monthlyData: res.monthlyData ?? [],
        })
      } catch (err: any) {
        setError(err.message ?? "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  const isInstructor = user?.role === "instructor"

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-zinc-500 mt-1">
              {isInstructor ? "Track your course performance." : "Monitor your learning progress."}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const statCards = [
    { label: "Total Hours", value: `${analyticsData.totalHours}h`, icon: Clock, change: "+12%", color: "text-primary" },
    { label: "Courses Completed", value: String(analyticsData.completedCourses), icon: BookOpen, change: "+1", color: "text-emerald-500" },
    { label: "Quiz Avg Score", value: `${analyticsData.quizAvgScore}%`, icon: Award, change: "+5%", color: "text-amber-500" },
    { label: "Streak Days", value: String(analyticsData.streakDays), icon: TrendingUp, change: "Best: 15", color: "text-purple-500" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-zinc-500 mt-1">
            {isInstructor ? "Track your course performance." : "Monitor your learning progress."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} variant="elevated" className="p-6">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{stat.change}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card variant="elevated" className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg">Weekly Learning</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <Skeleton className="h-64 w-full rounded-xl" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                      <XAxis dataKey="day" stroke="#a1a1aa" fontSize={12} />
                      <YAxis stroke="#a1a1aa" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e4e4e7",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                      />
                      <Bar dataKey="hours" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="elevated" className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg">Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <Skeleton className="h-64 w-full rounded-xl" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                      <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} />
                      <YAxis stroke="#a1a1aa" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e4e4e7",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                      />
                      <Line type="monotone" dataKey="hours" stroke="#7c3aed" strokeWidth={2} dot={{ fill: "#7c3aed", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
