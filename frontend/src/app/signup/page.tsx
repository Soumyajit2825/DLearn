"use client"

import { useState } from "react"
import Link from "next/link"
import { GraduationCap, Eye, EyeOff, ArrowRight, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/providers/auth-provider"
import { useWallet } from "@/providers/wallet-provider"
import { cn } from "@/lib/utils"

export default function SignupPage() {
  const { signup } = useAuth()
  const { connect, connected, address, connecting } = useWallet()
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "instructor",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.full_name || !form.email || !form.password) {
      setError("Please fill in all fields")
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (!terms) {
      setError("Please accept the terms and conditions")
      return
    }
    setLoading(true)
    try {
      await signup({ full_name: form.full_name, email: form.email, password: form.password, role: form.role })
    } catch (err: any) {
      setError(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleWalletConnect = async () => {
    setError("")
    try {
      await connect()
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet. Make sure Freighter is installed.")
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
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Create your account</h1>
          <p className="text-sm text-muted mt-2">Start your decentralized learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-[#fde8ea] border border-semantic-down/20 p-4 text-sm text-semantic-down">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-soft">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label>I want to</Label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setForm({ ...form, role: "student" })}
                className={cn("flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                  form.role === "student"
                    ? "border-primary bg-primary-bg text-primary"
                    : "border-hairline hover:border-muted-soft"
                )}>
                Learn
              </button>
              <button type="button" onClick={() => setForm({ ...form, role: "instructor" })}
                className={cn("flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                  form.role === "instructor"
                    ? "border-primary bg-primary-bg text-primary"
                    : "border-hairline hover:border-muted-soft"
                )}>
                Teach
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox id="terms" checked={terms} onCheckedChange={(checked) => setTerms(checked as boolean)} />
            <Label htmlFor="terms" className="text-xs text-muted leading-relaxed">
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and{" "}
              <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
            </Label>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Create account <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Separator />

          <Button type="button" variant="outline" className="w-full" size="lg" onClick={handleWalletConnect} loading={connecting}>
            {connected ? (
              <><Wallet className="mr-2 h-4 w-4" /> {address?.slice(0, 6)}...{address?.slice(-4)}</>
            ) : (
              <><Wallet className="mr-2 h-4 w-4" /> Connect Stellar Wallet</>
            )}
          </Button>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
