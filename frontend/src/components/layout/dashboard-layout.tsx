"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"
import { Breadcrumbs } from "./breadcrumbs"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ErrorBoundary } from "@/components/ui/error-boundary"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const breadcrumbMap: Record<string, { label: string; href?: string }[]> = {
  "/dashboard": [],
  "/dashboard/courses": [{ label: "Courses", href: "/dashboard/courses" }],
  "/dashboard/marketplace": [{ label: "Marketplace", href: "/dashboard/marketplace" }],
  "/dashboard/certificates": [{ label: "Certificates", href: "/dashboard/certificates" }],
  "/dashboard/assignments": [{ label: "Assignments", href: "/dashboard/assignments" }],
  "/dashboard/discussions": [{ label: "Discussions", href: "/dashboard/discussions" }],
  "/dashboard/analytics": [{ label: "Analytics", href: "/dashboard/analytics" }],
  "/dashboard/notifications": [{ label: "Notifications", href: "/dashboard/notifications" }],
  "/dashboard/settings": [{ label: "Settings", href: "/dashboard/settings" }],
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const crumbs = Object.entries(breadcrumbMap).reduce((acc, [path, items]) => {
    if (pathname.startsWith(path)) return items
    return acc
  }, [] as { label: string; href?: string }[])

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar />
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col lg:pl-64">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-surface-soft">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {crumbs.length > 0 && (
              <div className="mb-6">
                <Breadcrumbs items={crumbs} />
              </div>
            )}
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}
