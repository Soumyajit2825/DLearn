"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, DollarSign, TrendingUp, Activity } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const stats = [
  { label: "Total Users", value: "2,847", icon: Users, change: "+156 this month", color: "text-primary" },
  { label: "Total Courses", value: "124", icon: BookOpen, change: "+8 this month", color: "text-emerald-500" },
  { label: "Revenue", value: "85,200 XLM", icon: DollarSign, change: "+12.5%", color: "text-amber-500" },
  { label: "Active Users", value: "1,203", icon: TrendingUp, change: "42% of total", color: "text-purple-500" },
]

const weeklyData = [
  { day: "Mon", users: 120, revenue: 2400 },
  { day: "Tue", users: 145, revenue: 3100 },
  { day: "Wed", users: 132, revenue: 2800 },
  { day: "Thu", users: 168, revenue: 3500 },
  { day: "Fri", users: 154, revenue: 3200 },
  { day: "Sat", users: 98, revenue: 1800 },
  { day: "Sun", users: 76, revenue: 1200 },
]

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-zinc-500 mt-1">Platform overview and management.</p>
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

        <Card variant="elevated" className="p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="day" stroke="#a1a1aa" fontSize={12} />
                  <YAxis stroke="#a1a1aa" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e4e4e7" }} />
                  <Bar dataKey="users" fill="#7c3aed" radius={[8, 8, 0, 0]} name="Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
