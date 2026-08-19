"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Save, Plus, Trash2, GripVertical } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { toast } from "@/hooks/use-toast"

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    toast({ title: "Course updated!", variant: "success" })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Breadcrumbs items={[
          { label: "My Courses", href: "/dashboard/instructor/courses" },
          { label: "Edit Course" },
        ]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
            <p className="text-zinc-500 mt-1">Update your course content.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/courses/${params.id}`)}>Preview</Button>
            <Button onClick={handleSave} loading={saving}><Save className="mr-2 h-4 w-4" /> Save</Button>
          </div>
        </div>

        <Card variant="elevated" className="p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg">Course Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-5">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input defaultValue="Blockchain Fundamentals" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea defaultValue="Master the fundamentals of blockchain technology..." rows={4} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select defaultValue="blockchain">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="defi">DeFi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Select defaultValue="beginner">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price (XLM)</Label>
                <Input type="number" defaultValue={50} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
