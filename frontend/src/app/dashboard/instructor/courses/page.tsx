"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, BookOpen, Edit, Eye, MoreHorizontal, Users, BarChart3 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const instructorCourses = [
  { id: "1", title: "Blockchain Fundamentals", students: 234, lessons: 12, revenue: "11,700 XLM", status: "published", rating: 4.8 },
  { id: "2", title: "Advanced DeFi", students: 89, lessons: 8, revenue: "4,450 XLM", status: "published", rating: 4.6 },
  { id: "3", title: "Solidity for Beginners", students: 0, lessons: 6, revenue: "0 XLM", status: "draft", rating: 0 },
]

export default function InstructorCoursesPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-zinc-500 mt-1">Manage your course catalog.</p>
          </div>
          <Link href="/dashboard/instructor/courses/create">
            <Button><Plus className="mr-2 h-4 w-4" /> Create Course</Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : instructorCourses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses yet</h3>
            <Link href="/dashboard/instructor/courses/create">
              <Button>Create Your First Course</Button>
            </Link>
          </div>
        ) : (
          <Card variant="elevated" className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructorCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <p className="font-medium">{course.title}</p>
                    </TableCell>
                    <TableCell>{course.students}</TableCell>
                    <TableCell>{course.lessons}</TableCell>
                    <TableCell>{course.revenue}</TableCell>
                    <TableCell>
                      <Badge variant={course.status === "published" ? "success" : "warning"}>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.rating > 0 ? course.rating : "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/instructor/courses/${course.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/courses/${course.id}`}><Eye className="mr-2 h-4 w-4" /> View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/instructor/courses/${course.id}/students`}><Users className="mr-2 h-4 w-4" /> Students</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
