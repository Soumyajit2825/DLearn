"use client"

import React, { useState, useEffect } from "react"
import { Bell, CheckCheck, Info, AlertCircle, CheckCircle, AlertTriangle, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { cn } from "@/lib/utils"

const notifications = [
  { id: 1, title: "Course Completed!", message: "You completed 'React Mastery'. Your certificate is ready.", type: "success", read: false, time: "2 hours ago" },
  { id: 2, title: "New Assignment", message: "New assignment posted in 'Blockchain Fundamentals'.", type: "info", read: false, time: "5 hours ago" },
  { id: 3, title: "Quiz Reminder", message: "Don't forget to complete the 'Smart Contracts' quiz.", type: "warning", read: false, time: "1 day ago" },
  { id: 4, title: "Enrollment Confirmed", message: "You enrolled in 'Advanced DeFi'.", type: "success", read: true, time: "3 days ago" },
  { id: 5, title: "Payment Received", message: "Payment of 50 XLM confirmed for 'Blockchain Fundamentals'.", type: "info", read: true, time: "1 week ago" },
  { id: 6, title: "Certificate Expiring", message: "Your 'JavaScript Basics' certificate expires in 30 days.", type: "warning", read: true, time: "2 weeks ago" },
  { id: 7, title: "Course Update", message: "'Blockchain Fundamentals' has new content added.", type: "info", read: true, time: "3 weeks ago" },
]

const typeIcons: Record<string, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState(notifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, read: true })))
  }

  const filtered = filter === "unread" ? items.filter((n) => !n.read) : items

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-zinc-500 mt-1">Stay updated with your learning activity.</p>
          </div>
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "ghost"} size="sm" onClick={() => setFilter("all")}>All</Button>
            <Button variant={filter === "unread" ? "default" : "ghost"} size="sm" onClick={() => setFilter("unread")}>Unread</Button>
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} variant="elevated" className="p-5">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">All caught up!</h3>
            <p className="text-zinc-500">No new notifications.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((notification) => {
              const Icon = typeIcons[notification.type]
              return (
                <Card
                  key={notification.id}
                  variant="elevated"
                  className={cn(
                    "p-5 transition-all hover:shadow-md",
                    !notification.read && "border-l-4 border-l-primary"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      notification.type === "success" && "bg-emerald-50 dark:bg-emerald-950",
                      notification.type === "warning" && "bg-amber-50 dark:bg-amber-950",
                      notification.type === "error" && "bg-red-50 dark:bg-red-950",
                      notification.type === "info" && "bg-blue-50 dark:bg-blue-950",
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        notification.type === "success" && "text-emerald-500",
                        notification.type === "warning" && "text-amber-500",
                        notification.type === "error" && "text-red-500",
                        notification.type === "info" && "text-blue-500",
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {!notification.read && <Badge variant="blue" className="h-2 w-2 p-0 rounded-full" />}
                      </div>
                      <p className="text-sm text-zinc-500">{notification.message}</p>
                      <p className="text-xs text-zinc-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
