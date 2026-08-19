"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ChevronLeft, ChevronRight, Play, FileText, HelpCircle, Check } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { toast } from "@/hooks/use-toast"

const lessons: Record<string, {
  id: string; courseId: string; title: string; type: string; duration: string; content: string; completed: boolean; questions?: { id: string; text: string; options: string[]; correct: number }[]
}> = {
  l1: { id: "l1", courseId: "1", title: "Introduction to Blockchain", type: "video", duration: "45 min", content: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: false },
  l2: { id: "l2", courseId: "1", title: "How Distributed Ledgers Work", type: "article", duration: "60 min", content: "Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.", completed: false },
  l3: { id: "l3", courseId: "1", title: "Consensus Mechanisms", type: "video", duration: "50 min", content: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: false },
  l4: { id: "l4", courseId: "1", title: "Smart Contracts Overview", type: "video", duration: "55 min", content: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: false },
  l5: {
    id: "l5", courseId: "1", title: "Quiz: Blockchain Basics", type: "quiz", duration: "30 min", content: "", completed: false,
    questions: [
      { id: "q1", text: "What is a blockchain?", options: ["A distributed ledger", "A central database", "A type of cryptocurrency", "A programming language"], correct: 0 },
      { id: "q2", text: "Which consensus mechanism does Bitcoin use?", options: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake", "Proof of Authority"], correct: 1 },
      { id: "q3", text: "What is a smart contract?", options: ["A legal document", "A self-executing contract on blockchain", "A type of cryptocurrency", "A consensus algorithm"], correct: 1 },
    ],
  },
  l6: { id: "l6", courseId: "1", title: "Use Cases & Applications", type: "article", duration: "40 min", content: "Blockchain technology has found applications across numerous industries beyond cryptocurrency. Supply chain management, healthcare records, voting systems, and digital identity are just a few areas where blockchain is making an impact.", completed: false },
}

const lessonOrder = ["l1", "l2", "l3", "l4", "l5", "l6"]

export default function LessonPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const lesson = lessons[params.lessonId as string]
  const currentIdx = lessonOrder.indexOf(params.lessonId as string)
  const prevLesson = currentIdx > 0 ? lessonOrder[currentIdx - 1] : null
  const nextLesson = currentIdx < lessonOrder.length - 1 ? lessonOrder[currentIdx + 1] : null

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [params.lessonId])

  const handleMarkComplete = () => {
    setCompleted(true)
    toast({ title: "Lesson completed!", variant: "success" })
  }

  const handleSubmitQuiz = () => {
    if (!lesson || lesson.type !== "quiz" || !lesson.questions) return
    let score = 0
    lesson.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) score++
    })
    setQuizScore(score)
    setQuizSubmitted(true)
    setCompleted(true)
    toast({
      title: `Quiz completed! Score: ${score}/${lesson.questions.length}`,
      variant: score >= 2 ? "success" : "warning",
    })
  }

  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">Lesson not found</h2>
          <Link href="/dashboard/courses"><Button className="mt-4">Back to courses</Button></Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Breadcrumbs items={[
          { label: "Courses", href: "/dashboard/courses" },
          { label: "Blockchain Fundamentals", href: `/dashboard/courses/${params.id}` },
          { label: lesson.title },
        ]} />

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Badge variant="blue" className="text-xs uppercase">{lesson.type}</Badge>
              <span className="text-sm text-zinc-500">{lesson.duration}</span>
              {completed && <Badge variant="success">Completed</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">{lesson.title}</h1>

            <Card variant="elevated" className="p-0 overflow-hidden">
              {lesson.type === "video" && (
                <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                  <iframe
                    src={lesson.content}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {lesson.type === "article" && (
                <div className="p-8">
                  <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">{lesson.content}</p>
                </div>
              )}
              {lesson.type === "quiz" && lesson.questions && (
                <div className="p-8">
                  {quizSubmitted ? (
                    <div className="text-center py-8">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 mb-4">
                        <Check className="h-8 w-8 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
                      <p className="text-3xl font-bold text-primary mb-2">{quizScore}/{lesson.questions.length}</p>
                      <p className="text-zinc-500">{quizScore >= 2 ? "Great job! You passed." : "Keep studying and try again."}</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {lesson.questions.map((q, qi) => (
                        <div key={q.id}>
                          <p className="font-medium mb-3">{qi + 1}. {q.text}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                              <button
                                key={oi}
                                onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: oi })}
                                className={`w-full text-left rounded-xl border-2 px-4 py-3 text-sm transition-all ${
                                  quizAnswers[q.id] === oi
                                    ? "border-primary bg-primary-bg dark:bg-primary-bg-dark"
                                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button
                        onClick={handleSubmitQuiz}
                        className="w-full"
                        size="lg"
                        disabled={Object.keys(quizAnswers).length !== lesson.questions.length}
                      >
                        Submit Quiz
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-3">
                {prevLesson && (
                  <Link href={`/dashboard/courses/${params.id}/lessons/${prevLesson}`}>
                    <Button variant="outline"><ChevronLeft className="mr-2 h-4 w-4" /> Previous</Button>
                  </Link>
                )}
                {nextLesson && (
                  <Link href={`/dashboard/courses/${params.id}/lessons/${nextLesson}`}>
                    <Button variant="outline">Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                )}
              </div>
              {!completed && lesson.type !== "quiz" && (
                <Button onClick={handleMarkComplete}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark Complete
                </Button>
              )}
              {completed && nextLesson && (
                <Link href={`/dashboard/courses/${params.id}/lessons/${nextLesson}`}>
                  <Button>Next Lesson <ChevronRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
