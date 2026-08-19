"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, TrendingUp, DollarSign, BarChart3 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const stats = [
  { label: "Total Students", value: "456", icon: Users, change: "+12%", color: "text-primary" },
  { label: "Active Courses", value: "3", icon: BookOpen, change: "+1", color: "text-emerald-500" },
  { label: "Revenue", value: "16,150 XLM", icon: DollarSign, change: "+23%", color: "text-amber-500" },
  { label: "Avg Rating", value: "4.7", icon: TrendingUp, change: "+0.2", color: "text-purple-500" },
]

const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1900 },
  { month: "Mar", revenue: 2400 },
  { month: "Apr", revenue: 2800 },
  { month: "May", revenue: 3500 },
  { month: "Jun", revenue: 4350 },
]

const enrollmentData = [
  { month: "Jan", students: 45 },
  { month: "Feb", students: 78 },
  { month: "Mar", students: 102 },
  { month: "Apr", students: 134 },
  { month: "May", students: 89 },
  { month: "Jun", students: 156 },
]

export default function InstructorAnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-zinc-500 mt-1">Course performance metrics.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="elevated" className="p-6">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-8 w-24" />
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
              <CardTitle className="text-lg">Revenue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} />
                    <YAxis stroke="#a1a1aa" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e4e4e7" }} />
                    <Bar dataKey="revenue" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-lg">Enrollments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} />
                    <YAxis stroke="#a1a1aa" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e4e4e7" }} />
                    <Line type="monotone" dataKey="students" stroke="#7c3aed" strokeWidth={2} dot={{ fill: "#7c3aed", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
