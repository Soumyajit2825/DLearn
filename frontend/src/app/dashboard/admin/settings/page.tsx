"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { toast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast({ title: "Settings saved!", variant: "success" })
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-zinc-500 mt-1">Configure platform-wide settings.</p>
        </div>

        <Card variant="elevated" className="p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg">General</CardTitle>
            <CardDescription>Platform-wide configuration.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-5">
            <div className="space-y-2">
              <Label>Platform Name</Label>
              <Input defaultValue="DLearn" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Input defaultValue="XLM" />
              </div>
              <div className="space-y-2">
                <Label>Commission Rate (%)</Label>
                <Input type="number" defaultValue={5} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg">Features</CardTitle>
            <CardDescription>Toggle platform features.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-5">
            {[
              { label: "Student Registration", desc: "Allow new users to sign up" },
              { label: "Instructor Applications", desc: "Allow users to become instructors" },
              { label: "Stellar Payments", desc: "Enable Stellar payment processing" },
              { label: "Certificate Minting", desc: "Enable blockchain certificate generation" },
              { label: "Discussion Forums", desc: "Enable course discussion forums" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving} size="lg">
            <Save className="mr-2 h-4 w-4" /> Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
