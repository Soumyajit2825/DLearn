"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, Shield, Bell, CreditCard, Palette, Trash2, Wallet, Save, Eye, EyeOff } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "next-themes"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import api from "@/lib/api"
import type { User as UserType } from "@/types"

const defaultNotifications: Record<string, boolean> = {
  courseUpdates: true,
  assignmentReminders: true,
  certificateAwards: true,
  discussionReplies: true,
  marketingEmails: false,
}

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [notifications, setNotifications] = useState(defaultNotifications)

  useEffect(() => {
    setMounted(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? "")
      setBio(user.bio ?? "")
    }
  }, [user])

  const handleProfileSave = async () => {
    setSaving(true)
    try {
      const updated = await api.patch<UserType>("/users/profile", { full_name: fullName, bio })
      updateUser(updated)
      toast({ title: "Profile updated!", variant: "success" })
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "error" })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "error" })
      return
    }
    if (!currentPassword || !newPassword) {
      toast({ title: "Please fill in all password fields", variant: "error" })
      return
    }
    setSaving(true)
    try {
      await api.patch("/users/profile", { currentPassword, newPassword })
      toast({ title: "Password updated!", variant: "success" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast({ title: "Password update failed", description: err.message, variant: "error" })
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationsSave = async () => {
    setSaving(true)
    try {
      await api.patch("/notifications/settings", notifications)
      toast({ title: "Notification preferences saved!", variant: "success" })
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "error" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-zinc-500 mt-1">Manage your account and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" /> Profile</TabsTrigger>
            <TabsTrigger value="account"><Shield className="mr-2 h-4 w-4" /> Account</TabsTrigger>
            <TabsTrigger value="security"><Wallet className="mr-2 h-4 w-4" /> Security</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" /> Notifications</TabsTrigger>
            <TabsTrigger value="billing"><CreditCard className="mr-2 h-4 w-4" /> Billing</TabsTrigger>
            <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4" /> Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card variant="elevated" className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg">Profile Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="text-lg">{user?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">Change photo</Button>
                    <p className="text-xs text-zinc-400 mt-1">JPG, PNG. Max 2MB.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue={user?.email} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea placeholder="Tell us about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
                </div>
                <Button onClick={handleProfileSave} loading={saving}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card variant="elevated" className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg">Account Details</CardTitle>
                <CardDescription>Manage your account settings.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={user?.email} />
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Change Password</h4>
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>
                  <Button onClick={handlePasswordChange} loading={saving}>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card variant="elevated" className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg">Security</CardTitle>
                <CardDescription>Manage your wallet and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                <div className="flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Stellar Wallet</p>
                      {user?.stellar_wallet ? (
                        <p className="text-xs text-zinc-500 font-mono">{user.stellar_wallet}</p>
                      ) : (
                        <p className="text-xs text-zinc-400">Not connected</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {user?.stellar_wallet ? "Disconnect" : "Connect"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-zinc-500">Add an extra layer of security.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card variant="elevated" className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you receive.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                {[
                  { key: "courseUpdates", label: "Course Updates", desc: "When courses are updated or new content added" },
                  { key: "assignmentReminders", label: "Assignment Reminders", desc: "Reminders about upcoming deadlines" },
                  { key: "certificateAwards", label: "Certificate Awards", desc: "When you earn a new certificate" },
                  { key: "discussionReplies", label: "Discussion Replies", desc: "When someone replies to your posts" },
                  { key: "marketingEmails", label: "Marketing Emails", desc: "Updates about new courses and features" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
                <Button onClick={handleNotificationsSave} loading={saving}><Save className="mr-2 h-4 w-4" /> Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card variant="elevated" className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg">Current Plan</CardTitle>
                <CardDescription>You are on the Free plan.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-900 p-4">
                  <div>
                    <p className="font-medium">Free Plan</p>
                    <p className="text-xs text-zinc-500">5 courses limit</p>
                  </div>
                  <Link href="/pricing"><Button size="sm">Upgrade</Button></Link>
                </div>
                <Separator />
                <h4 className="font-medium text-sm">Payment History</h4>
                <div className="space-y-2">
                  {[{ date: "2024-03-15", amount: "50 XLM", course: "Blockchain Fundamentals", status: "Completed" }].map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-2">
                      <div>
                        <p className="font-medium">{p.course}</p>
                        <p className="text-xs text-zinc-500">{p.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{p.amount}</p>
                        <Badge variant="success" className="text-[10px]">{p.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card variant="elevated" className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>Customize the look and feel.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                {mounted && (
                  <div className="space-y-3">
                    <Label>Theme</Label>
                    <div className="flex gap-3">
                      {["light", "dark", "system"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium capitalize transition-all ${
                            theme === t ? "border-primary bg-primary-bg dark:bg-primary-bg-dark" : "border-zinc-200 dark:border-zinc-800"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card variant="elevated" className="p-6 border-red-200 dark:border-red-900">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg text-red-600 flex items-center gap-2"><Trash2 className="h-5 w-5" /> Danger Zone</CardTitle>
            <CardDescription>Irreversible actions.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="danger">Delete Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>This action cannot be undone. All your data will be permanently deleted.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-zinc-500">Type DELETE to confirm.</p>
                  <Input placeholder="Type DELETE" />
                  <Button variant="danger" className="w-full">Delete My Account</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
