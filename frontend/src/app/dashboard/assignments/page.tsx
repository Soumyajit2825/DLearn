"use client"

import { useState, useEffect } from "react"
import { FileText, Clock, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import api from "@/lib/api"
import type { Assignment } from "@/types"

interface AssignmentDisplay {
  id: string
  course: string
  title: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  score: number | null
}

export default function AssignmentsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<AssignmentDisplay[]>([])
  const [submitContent, setSubmitContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get<Assignment[]>("/assignments")
        setAssignments(mapAssignments(res ?? []))
      } catch (err: any) {
        setError(err.message ?? "Failed to load assignments")
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  function mapAssignments(data: Assignment[]): AssignmentDisplay[] {
    return data.map((a) => {
      let status: "pending" | "submitted" | "graded" = "pending"
      let score: number | null = null
      if (a.submission) {
        if (a.submission.score != null) {
          status = "graded"
          score = a.submission.score
        } else {
          status = "submitted"
        }
      }
      return {
        id: a.id,
        course: a.course?.title ?? "Unknown",
        title: a.title,
        dueDate: a.due_date ? new Date(a.due_date).toLocaleDateString() : "No date",
        status,
        score,
      }
    })
  }

  const handleSubmit = async () => {
    if (!submitContent.trim() || !selectedAssignment) return
    setSubmitting(true)
    try {
      await api.post(`/assignments/${selectedAssignment}/submit`, { content: submitContent })
      const res = await api.get<Assignment[]>("/assignments")
      setAssignments(mapAssignments(res ?? []))
      setSubmitContent("")
      setSelectedAssignment(null)
      toast({ title: "Assignment submitted!", variant: "success" })
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "error" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-zinc-500 mt-1">Track and submit your course assignments.</p>
        </div>

        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} variant="elevated" className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No assignments</h3>
            <p className="text-zinc-500">You have no pending assignments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <Card key={assignment.id} variant="elevated" className="p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <FileText className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-zinc-500">{assignment.course}</p>
                      <h3 className="font-semibold mt-0.5">{assignment.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Due {assignment.dueDate}</span>
                        {assignment.score !== null && <span>Score: {assignment.score}/100</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {assignment.status === "pending" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedAssignment(assignment.id)}>
                            <Upload className="mr-1.5 h-3.5 w-3.5" /> Submit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Submit Assignment</DialogTitle>
                            <DialogDescription>{assignment.title} - {assignment.course}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Textarea
                              placeholder="Enter your submission content..."
                              value={submitContent}
                              onChange={(e) => setSubmitContent(e.target.value)}
                              rows={6}
                            />
                            <Button className="w-full" onClick={handleSubmit} loading={submitting}>
                              Submit Assignment
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {assignment.status === "submitted" && <Badge variant="warning">Submitted</Badge>}
                    {assignment.status === "graded" && (
                      <div className="text-center">
                        <p className="text-lg font-bold text-emerald-500">{assignment.score}%</p>
                        <Badge variant="success">Graded</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
