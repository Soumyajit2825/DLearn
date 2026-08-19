"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, Check, ArrowRight, ArrowLeft, Upload, Wallet, Sparkles, User, BookOpen, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const interests = [
  "Web Development", "Data Science", "Blockchain", "AI & Machine Learning",
  "Design", "Business", "Marketing", "Cloud Computing", "Cybersecurity", "Mobile Development",
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [role, setRole] = useState<"student" | "instructor">("student")
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const steps = ["Welcome", "Interests", "Role", "Wallet", "Done"]

  const handleComplete = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-soft px-4 py-12">
      <Card className="w-full max-w-lg p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shrink-0">
            <GraduationCap className="h-4 w-4 text-on-primary" />
          </Link>
          <div className="flex-1 flex gap-1">
            {steps.map((s, i) => (
              <div
                key={i}
                className={cn("h-1.5 flex-1 rounded-pill transition-all", i <= step ? "bg-primary" : "bg-surface-strong")}
              />
            ))}
          </div>
        </div>

        {step === 0 && (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-bg mb-6">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-ink mb-2">Welcome to DLearn!</h1>
            <p className="text-muted mb-8">Let&apos;s set up your profile in a few steps.</p>
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-surface-strong flex items-center justify-center overflow-hidden">
                  {avatarFile ? (
                    <img src={URL.createObjectURL(avatarFile)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-muted-soft" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-sm hover:bg-primary-active transition-colors">
                  <Upload className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              <p className="text-sm text-muted">Add a profile photo (optional)</p>
            </div>
            <Button onClick={() => setStep(1)} size="lg" className="w-full">
              Get started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">What interests you?</h2>
            <p className="text-sm text-muted mb-6">Select topics you want to learn about.</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {interests.map((interest) => {
                const selected = selectedInterests.includes(interest)
                return (
                  <button
                    key={interest}
                    onClick={() => setSelectedInterests(prev => selected ? prev.filter(i => i !== interest) : [...prev, interest])}
                    className={cn(
                      "rounded-pill px-4 py-2 text-sm font-medium transition-all border",
                      selected
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-canvas text-body border-hairline hover:border-muted-soft"
                    )}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button className="flex-1" onClick={() => setStep(2)} disabled={selectedInterests.length === 0}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">What&apos;s your role?</h2>
            <p className="text-sm text-muted mb-6">Choose how you&apos;ll use the platform.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setRole("student")}
                className={cn("rounded-xl border-2 p-6 text-center transition-all",
                  role === "student" ? "border-primary bg-primary-bg" : "border-hairline hover:border-muted-soft"
                )}
              >
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="font-semibold text-ink">Student</p>
                <p className="text-xs text-muted mt-1">Learn and earn certificates</p>
              </button>
              <button
                onClick={() => setRole("instructor")}
                className={cn("rounded-xl border-2 p-6 text-center transition-all",
                  role === "instructor" ? "border-primary bg-primary-bg" : "border-hairline hover:border-muted-soft"
                )}
              >
                <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="font-semibold text-ink">Instructor</p>
                <p className="text-xs text-muted mt-1">Create and sell courses</p>
              </button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 mb-6">
              <Wallet className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-ink mb-2">Connect your Stellar wallet</h2>
            <p className="text-sm text-muted mb-6">Optional but recommended for earning rewards and certificates.</p>
            <div className="space-y-3 mb-8">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Wallet className="mr-3 h-5 w-5" />
                Connect Stellar Wallet
              </Button>
              <Button variant="ghost" className="w-full text-sm text-muted" onClick={() => setStep(4)}>
                Skip for now
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button className="flex-1" onClick={() => setStep(4)}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e6f7ed] mb-6">
              <Check className="h-10 w-10 text-semantic-up" />
            </div>
            <h1 className="text-2xl font-semibold text-ink mb-2">You&apos;re all set!</h1>
            <p className="text-muted mb-6">Your profile is ready. Start exploring courses and learning.</p>
            <div className="bg-surface-soft rounded-xl p-6 mb-8 text-left space-y-3">
              <div className="flex items-center gap-3 text-sm text-body">
                <Check className="h-4 w-4 text-semantic-up" /> <span>Profile created</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-body">
                <Check className="h-4 w-4 text-semantic-up" /> <span>{selectedInterests.length} interests selected</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-body">
                <Check className="h-4 w-4 text-semantic-up" /> <span>Role: {role}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-body">
                <Check className="h-4 w-4 text-semantic-up" /> <span>Ready to learn</span>
              </div>
            </div>
            <Button onClick={handleComplete} size="lg" className="w-full" loading={loading}>
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
