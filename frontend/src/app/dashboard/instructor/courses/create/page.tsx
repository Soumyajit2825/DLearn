"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { toast } from "@/hooks/use-toast"

export default function CreateCoursePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [lessons, setLessons] = useState([{ title: "", type: "video", duration: "", content: "" }])

  const addLesson = () => {
    setLessons([...lessons, { title: "", type: "video", duration: "", content: "" }])
  }

  const removeLesson = (idx: number) => {
    setLessons(lessons.filter((_, i) => i !== idx))
  }

  const updateLesson = (idx: number, field: string, value: string) => {
    const updated = lessons.map((l, i) => i === idx ? { ...l, [field]: value } : l)
    setLessons(updated)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSaving(false)
    toast({ title: "Course created!", variant: "success" })
    router.push("/dashboard/instructor/courses")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Breadcrumbs items={[
          { label: "My Courses", href: "/dashboard/instructor/courses" },
          { label: "Create Course" },
        ]} />

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Course</h1>
          <p className="text-zinc-500 mt-1">Set up your course content and pricing.</p>
        </div>

        <Card variant="elevated" className="p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg">Course Details</CardTitle>
            <CardDescription>Basic information about your course.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-5">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input placeholder="e.g. Blockchain Fundamentals" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe what students will learn..." rows={4} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="defi">DeFi</SelectItem>
                    <SelectItem value="web3">Web3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price (XLM)</Label>
                <Input type="number" placeholder="50" min={0} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="p-6">
          <CardHeader className="p-0 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Curriculum</CardTitle>
                <CardDescription>Add lessons to your course.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addLesson}>
                <Plus className="mr-1.5 h-4 w-4" /> Add Lesson
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-zinc-400 cursor-grab" />
                    <span className="text-sm font-medium">Lesson {idx + 1}</span>
                    <Badge variant="secondary" className="text-[10px]">{lesson.type}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeLesson(idx)} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <Input
                    placeholder="Lesson title"
                    value={lesson.title}
                    onChange={(e) => updateLesson(idx, "title", e.target.value)}
                  />
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Select value={lesson.type} onValueChange={(v) => updateLesson(idx, "type", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Duration (min)" value={lesson.duration} onChange={(e) => updateLesson(idx, "duration", e.target.value)} />
                  </div>
                  <Textarea
                    placeholder="Lesson content or video URL..."
                    value={lesson.content}
                    onChange={(e) => updateLesson(idx, "content", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={addLesson}>
              <Plus className="mr-2 h-4 w-4" /> Add Another Lesson
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} loading={saving} size="lg">
            <Save className="mr-2 h-4 w-4" /> Create Course
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
