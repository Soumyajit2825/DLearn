"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Star, Clock, BookOpen, Users, Award, Check, ShoppingBag, Play, ArrowLeft, Wallet } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import api from "@/lib/api"
import type { Course } from "@/types"

interface CourseDetail {
  id: string
  title: string
  description: string
  longDescription: string
  instructor: { name: string; avatar: string | null; bio: string }
  rating: number
  students: number
  lessons: number
  duration: string
  level: string
  category: string
  price: number
  currency: string
  skills: string[]
  curriculum: { title: string; duration: string; free: boolean }[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courseData, setCourseData] = useState<CourseDetail | null>(null)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get<Course>(`/courses/${params.id}`)
        const syllabus = res.syllabus ?? []
        setCourseData({
          id: res.id,
          title: res.title,
          description: res.description,
          longDescription: res.description,
          instructor: {
            name: res.instructor?.full_name ?? "Unknown",
            avatar: res.instructor?.avatar_url ?? null,
            bio: res.instructor?.bio ?? "",
          },
          rating: res.rating,
          students: res.enrolled_count,
          lessons: syllabus.length,
          duration: `${res.duration_hours}h`,
          level: res.level,
          category: res.category,
          price: res.price,
          currency: res.currency,
          skills: [],
          curriculum: syllabus.map((l) => ({
            title: l.title,
            duration: `${l.duration_minutes} min`,
            free: l.is_free,
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

  const handleEnroll = () => setShowPayment(true)

  const handlePaymentConfirm = async () => {
    setEnrolling(true)
    try {
      await api.post("/enrollments", { courseId: params.id })
      setShowPayment(false)
      setEnrolled(true)
      toast({ title: "Enrolled successfully!", description: "You can now start learning.", variant: "success" })
      router.push("/dashboard/courses/" + params.id)
    } catch (err: any) {
      toast({ title: "Enrollment failed", description: err.message, variant: "error" })
    } finally {
      setEnrolling(false)
    }
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/dashboard/marketplace")}>Back to Marketplace</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Breadcrumbs items={[
          { label: "Marketplace", href: "/dashboard/marketplace" },
          { label: courseData?.title ?? "Loading..." },
        ]} />

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        ) : courseData && (
          <>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 sm:p-12">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">{courseData.level}</Badge>
                  <Badge variant="blue" className="bg-white/20 text-white border-0">{courseData.category}</Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{courseData.title}</h1>
                <p className="text-zinc-300 max-w-2xl mb-6">{courseData.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {courseData.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {courseData.students} students</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {courseData.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {courseData.duration}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card variant="elevated" className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-lg">About this course</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{courseData.longDescription}</p>
                    {courseData.skills.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-sm mb-3">What you&apos;ll learn</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {courseData.skills.map((skill, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                              <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card variant="elevated" className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-lg">Curriculum</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-2">
                    {courseData.curriculum.map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                        <div className="flex items-center gap-3">
                          {item.free ? <Play className="h-4 w-4 text-emerald-500" /> : <BookOpen className="h-4 w-4 text-zinc-400" />}
                          <span className="text-sm">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-400">{item.duration}</span>
                          {item.free && <Badge variant="success" className="text-[10px]">Free</Badge>}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

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
                        <p className="font-medium">{courseData.instructor.name}</p>
                        <p className="text-xs text-zinc-500">Instructor</p>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-500">{courseData.instructor.bio}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card variant="elevated" className="p-6 sticky top-24">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold">{courseData.price} <span className="text-lg text-zinc-500">{courseData.currency}</span></p>
                    {courseData.price > 0 && (
                      <p className="text-xs text-zinc-400 mt-1">Approx. ${(courseData.price * 0.12).toFixed(2)} USD</p>
                    )}
                  </div>
                  {enrolled ? (
                    <Link href={`/dashboard/courses/${params.id}`}>
                      <Button className="w-full" size="lg"><Play className="mr-2 h-4 w-4" /> Start Learning</Button>
                    </Link>
                  ) : (
                    <Button className="w-full" size="lg" onClick={handleEnroll}>
                      <ShoppingBag className="mr-2 h-4 w-4" /> Enroll Now
                    </Button>
                  )}
                  <div className="mt-4 space-y-2 text-xs text-zinc-500 text-center">
                    <p>7-day money-back guarantee</p>
                    <p>Full lifetime access</p>
                    <p>Certificate on completion</p>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-zinc-500">Duration</span><span>{courseData.duration}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">Lessons</span><span>{courseData.lessons}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">Level</span><span>{courseData.level}</span></div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Enrollment</DialogTitle>
            <DialogDescription>Pay with Stellar to enroll in this course.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-500">Course</span>
                <span className="font-medium">{courseData?.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Amount</span>
                <span className="font-bold text-lg">{courseData?.price} {courseData?.currency}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handlePaymentConfirm} loading={enrolling}>
              <Wallet className="mr-2 h-4 w-4" /> Pay with Stellar
            </Button>
            <p className="text-xs text-zinc-500 text-center">You&apos;ll be redirected to confirm the transaction in your wallet.</p>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
