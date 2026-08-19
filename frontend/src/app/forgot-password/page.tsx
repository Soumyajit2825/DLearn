"use client"

import { useState } from "react"
import Link from "next/link"
import { GraduationCap, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email) {
      setError("Please enter your email")
      return
    }
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSent(true)
    } catch {
      setError("Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-soft px-4 py-12">
      <Card className="w-full max-w-md p-8 sm:p-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <GraduationCap className="h-5 w-5 text-on-primary" />
            </div>
            <span className="text-xl font-semibold text-ink">DLearn</span>
          </Link>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f7ed] mb-6">
              <CheckCircle className="h-7 w-7 text-semantic-up" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink mb-2">Check your email</h1>
            <p className="text-sm text-muted mb-8">
              We&apos;ve sent a password reset link to <strong className="text-ink">{email}</strong>
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-bg mb-4">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink">Forgot password?</h1>
              <p className="text-sm text-muted mt-2">We&apos;ll send you a reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-[#fde8ea] border border-semantic-down/20 p-4 text-sm text-semantic-down">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Send reset link
              </Button>

              <p className="text-center text-sm">
                <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" /> Back to login
                </Link>
              </p>
            </form>
          </>
        )}
      </Card>
    </div>
  )
}
