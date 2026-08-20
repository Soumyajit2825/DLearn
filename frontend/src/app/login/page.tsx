"use client"

import { useState } from "react"
import Link from "next/link"
import { GraduationCap, Eye, EyeOff, ArrowRight, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"
import { useWallet } from "@/providers/wallet-provider"

export default function LoginPage() {
  const { login } = useAuth()
  const { connect, connected, address, connecting } = useWallet()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || "Invalid email or password")
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
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Welcome back</h1>
          <p className="text-sm text-muted mt-2">Sign in to continue learning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-[#fde8ea] border border-semantic-down/20 p-4 text-sm text-semantic-down">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-soft hover:text-muted"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Sign in <ArrowRight className="ml-2 h-4 w-4" />
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
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
