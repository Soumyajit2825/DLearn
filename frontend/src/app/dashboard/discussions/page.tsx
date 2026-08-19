"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Plus, ChevronRight, User, Clock, Search } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import api from "@/lib/api"

interface Thread {
  id: number
  course: string
  title: string
  author: string
  replies: number
  time: string
  pinned: boolean
}

const courses = ["All Courses", "Blockchain Fundamentals", "React Mastery", "Advanced DeFi", "Solidity Development"]

export default function DiscussionsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const [search, setSearch] = useState("")
  const [courseFilter, setCourseFilter] = useState("All Courses")
  const [showNewPost, setShowNewPost] = useState(false)
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [postCourse, setPostCourse] = useState("")
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get<any[]>("/discussions")
        setThreads(
          (res ?? []).map((t: any, i: number) => ({
            id: t.id ?? i,
            course: t.course ?? "General",
            title: t.title,
            author: t.author?.full_name ?? t.author ?? "Unknown",
            replies: t.replies ?? t.reply_count ?? 0,
            time: t.created_at ? new Date(t.created_at).toLocaleDateString() : "Recently",
            pinned: t.pinned ?? false,
          }))
        )
      } catch (err: any) {
        setError(err.message ?? "Failed to load discussions")
      } finally {
        setLoading(false)
      }
    }

    fetchThreads()
  }, [])

  const filtered = threads.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    if (courseFilter !== "All Courses" && t.course !== courseFilter) return false
    return true
  })

  const handlePost = async () => {
    if (!postTitle.trim() || !postContent.trim()) return
    setPosting(true)
    try {
      await api.post("/discussions", { title: postTitle, content: postContent, course: postCourse || undefined })
      const res = await api.get<any[]>("/discussions")
      setThreads(
        (res ?? []).map((t: any, i: number) => ({
          id: t.id ?? i,
          course: t.course ?? "General",
          title: t.title,
          author: t.author?.full_name ?? t.author ?? "Unknown",
          replies: t.replies ?? t.reply_count ?? 0,
          time: t.created_at ? new Date(t.created_at).toLocaleDateString() : "Recently",
          pinned: t.pinned ?? false,
        }))
      )
      setPostTitle("")
      setPostContent("")
      setPostCourse("")
      setShowNewPost(false)
      toast({ title: "Discussion posted!", variant: "success" })
    } catch (err: any) {
      toast({ title: "Failed to post", description: err.message, variant: "error" })
    } finally {
      setPosting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Discussions</h1>
            <p className="text-zinc-500 mt-1">Join the conversation with fellow learners.</p>
          </div>
          <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> New Discussion</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start a Discussion</DialogTitle>
                <DialogDescription>Share your thoughts, ask questions, or start a conversation.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="Discussion title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
                <Select value={postCourse} onValueChange={setPostCourse}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.filter(c => c !== "All Courses").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Textarea placeholder="Write your post..." value={postContent} onChange={(e) => setPostContent(e.target.value)} rows={6} />
                <Button className="w-full" onClick={handlePost} loading={posting}>Post Discussion</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input placeholder="Search discussions..." className="pl-10 rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full sm:w-44 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>{courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} variant="elevated" className="p-6">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((thread) => (
              <Card key={thread.id} variant="elevated" className="p-5 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {thread.pinned && <Badge variant="blue" className="text-[10px]">Pinned</Badge>}
                      <Badge variant="secondary" className="text-[10px]">{thread.course}</Badge>
                    </div>
                    <h3 className="font-medium hover:text-primary transition-colors">{thread.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {thread.author}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {thread.time}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {thread.replies} replies</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-300 shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
