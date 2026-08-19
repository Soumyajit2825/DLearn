"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Award,
  MessageSquare,
  Settings,
  BarChart3,
  Users,
  GraduationCap,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
  exact?: boolean
}

const studentNav: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard", exact: true },
  { label: "My Courses", icon: BookOpen, href: "/dashboard/courses" },
  { label: "Marketplace", icon: ShoppingBag, href: "/dashboard/marketplace" },
  { label: "Certificates", icon: Award, href: "/dashboard/certificates" },
  { label: "Assignments", icon: GraduationCap, href: "/dashboard/assignments" },
  { label: "Discussions", icon: MessageSquare, href: "/dashboard/discussions" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Notifications", icon: Settings, href: "/dashboard/notifications" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

const instructorNav: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard", exact: true },
  { label: "My Courses", icon: BookOpen, href: "/dashboard/instructor/courses" },
  { label: "Students", icon: Users, href: "/dashboard/instructor/courses" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/instructor/analytics" },
  { label: "Marketplace", icon: ShoppingBag, href: "/dashboard/marketplace" },
  { label: "Certificates", icon: Award, href: "/dashboard/certificates" },
  { label: "Discussions", icon: MessageSquare, href: "/dashboard/discussions" },
  { label: "Notifications", icon: Settings, href: "/dashboard/notifications" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

const adminNav: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard/admin" },
  { label: "Users", icon: Users, href: "/dashboard/admin/users" },
  { label: "Courses", icon: BookOpen, href: "/dashboard/admin/courses" },
  { label: "Transactions", icon: ShoppingBag, href: "/dashboard/admin/transactions" },
  { label: "Settings", icon: Settings, href: "/dashboard/admin/settings" },
]

interface SidebarProps {
  collapsed?: boolean
  onClose?: () => void
}

export function Sidebar({ collapsed, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = user?.role === "admin" ? adminNav : user?.role === "instructor" ? instructorNav : studentNav

  return (
    <div className="flex h-full flex-col bg-canvas border-r border-hairline">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-hairline">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
            DLearn
          </Link>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-bg text-primary dark:bg-primary-bg-dark dark:text-primary-text-dark"
                  : "text-body hover:bg-surface-soft hover:text-ink"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-hairline p-4">
        {!collapsed && user && (
          <div className="mb-3 px-3 py-2">
            <p className="text-sm font-medium truncate">{user.full_name}</p>
            <p className="text-xs text-muted truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-body hover:bg-surface-soft hover:text-semantic-down transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  )
}
