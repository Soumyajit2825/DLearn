"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { BookOpen, CheckCircle, Circle, Clock, Award, ArrowLeft, Play } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import type { Course } from "@/types"

interface LessonDisplay {
  id: string
  title: string
  duration: string
  completed: boolean
  type: string
}

interface CourseDetail {
  id: string
  title: string
  description: string
  instructor: { name: string; avatar: string | null; bio: string }
  category: string
  level: string
  duration: string
  lessons: LessonDisplay[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courseData, setCourseData] = useState<CourseDetail | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get<Course>(`/courses/${params.id}`)
        const syllabus = res.syllabus ?? []
        setCourseData({
          id: res.id,
          title: res.title,
          description: res.description,
          instructor: {
            name: res.instructor?.full_name ?? "Unknown",
            avatar: res.instructor?.avatar_url ?? null,
            bio: res.instructor?.bio ?? "",
          },
          category: res.category,
          level: res.level,
          duration: `${res.duration_hours}h`,
          lessons: syllabus.map((l) => ({
            id: l.id,
            title: l.title,
            duration: `${l.duration_minutes} min`,
            completed: false,
            type: l.content_type,
          })),
        })
      } catch (err: any) {
        setError(err.message ?? "Failed to load course")
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.id])

  const completedLessons = courseData?.lessons.filter((l) => l.completed).length ?? 0
  const totalLessons = courseData?.lessons.length ?? 0
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const nextLesson = courseData?.lessons.find((l) => !l.completed)

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/dashboard/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={[
          { label: "Courses", href: "/dashboard/courses" },
          { label: courseData?.title ?? "Loading..." },
        ]} />

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : courseData && (
          <>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-active p-8 sm:p-12">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">{courseData.level}</Badge>
                  <Badge variant="blue" className="bg-white/20 text-white border-0">{courseData.category}</Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{courseData.title}</h1>
                <p className="text-blue-200 max-w-2xl mb-6">{courseData.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-blue-200">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {courseData.duration}</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {totalLessons} lessons</span>
                  <span className="flex items-center gap-1.5"><Award className="h-4 w-4" /> Certificate</span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card variant="elevated" className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-lg">Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1">
                        <Progress value={progress} />
                      </div>
                      <span className="text-2xl font-bold text-primary">{progress}%</span>
                    </div>
                    <p className="text-sm text-zinc-500">{completedLessons} of {totalLessons} lessons completed</p>
                  </CardContent>
                </Card>

                <Card variant="elevated" className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-lg">Syllabus</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-1">
                    {courseData.lessons.map((lesson, idx) => (
                      <div key={lesson.id}>
                        <Link
                          href={`/dashboard/courses/${params.id}/lessons/${lesson.id}`}
                          className={cn(
                            "flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all group",
                            lesson.completed ? "hover:bg-zinc-50 dark:hover:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                          )}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                            {lesson.completed ? (
                              <CheckCircle className="h-6 w-6 text-emerald-500" />
                            ) : lesson.id === nextLesson?.id ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                                <Play className="h-3.5 w-3.5 ml-0.5" />
                              </div>
                            ) : (
                              <Circle className="h-6 w-6 text-zinc-300 dark:text-zinc-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium",
                              lesson.completed ? "text-zinc-500" : "text-zinc-900 dark:text-white"
                            )}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" /> {lesson.duration}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-[10px] uppercase">{lesson.type}</Badge>
                        </Link>
                        {idx < courseData.lessons.length - 1 && (
                          <Separator className="ml-12 w-auto" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card variant="elevated" className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-lg">Instructor</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-bg dark:bg-primary-bg-dark text-primary font-bold">
                        {courseData.instructor.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{courseData.instructor.name}</p>
                        <p className="text-xs text-zinc-500">Instructor</p>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-500">{courseData.instructor.bio}</p>
                  </CardContent>
                </Card>

                <Card variant="elevated" className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-lg">Continue Learning</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {nextLesson ? (
                      <Link href={`/dashboard/courses/${params.id}/lessons/${nextLesson.id}`}>
                        <Button className="w-full" size="lg">
                          <Play className="mr-2 h-4 w-4" /> Continue
                        </Button>
                      </Link>
                    ) : (
                      <div className="text-center">
                        <Award className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
                        <p className="font-medium text-sm">Course completed!</p>
                        <p className="text-xs text-zinc-500 mt-1">Your certificate is ready.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
