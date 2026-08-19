"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Check,
  ChevronDown,
  Shield,
  CreditCard,
  Puzzle,
  BarChart3,
  Globe,
  Award,
  Star,
  Menu,
  X,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const features = [
  { icon: Shield, title: "Blockchain Certificates", desc: "Tamper-proof credentials verified on the Stellar network. Every certificate is an immutable record you own forever." },
  { icon: CreditCard, title: "Stellar Payments", desc: "Instant, near-zero fee payments in XLM and USDC. No intermediaries, no delays, no hidden costs." },
  { icon: Puzzle, title: "Corsair Integrations", desc: "Seamlessly connect with GitHub Classroom, Slack, Discord, and Google Calendar for a unified learning workflow." },
  { icon: BarChart3, title: "Smart Progress", desc: "AI-driven recommendations and real-time progress tracking that adapts to your learning pace." },
  { icon: Globe, title: "Global Community", desc: "Learn from top instructors across the world. Collaborate, discuss, and grow together." },
  { icon: Award, title: "Verified Skills", desc: "Employer-verified skill endorsements tied to your on-chain credentials. Share your achievements with confidence." },
]

const steps = [
  { num: "01", title: "Enroll", desc: "Browse hundreds of courses and enroll with a single Stellar transaction." },
  { num: "02", title: "Learn", desc: "Access rich video lessons, interactive quizzes, and hands-on projects at your own pace." },
  { num: "03", title: "Complete", desc: "Finish all lessons and pass assessments to demonstrate mastery." },
  { num: "04", title: "Get Certified", desc: "Receive a blockchain-verified certificate minted directly to your Stellar wallet." },
  { num: "05", title: "Share", desc: "Share your verifiable credentials anywhere — employers, LinkedIn, or your portfolio." },
]

const testimonials = [
  { name: "Sarah Chen", role: "Software Engineer", content: "The blockchain certificates helped me land my dream job. Employers love being able to verify my credentials instantly on-chain.", rating: 5 },
  { name: "Marcus Johnson", role: "Data Scientist", content: "The course quality rivals top universities at a fraction of the cost. The Stellar integration makes everything seamless.", rating: 5 },
  { name: "Priya Patel", role: "Product Manager", content: "Learning at my own pace while earning verifiable credentials is game-changing. The Corsair integrations with my calendar keep me on track.", rating: 5 },
]

const plans = [
  {
    name: "Starter", price: "0", currency: "XLM", description: "Perfect for getting started",
    features: ["Access to 5 free courses", "Basic blockchain certificates", "Community forum access", "Course previews"],
  },
  {
    name: "Pro", price: "50", currency: "XLM/mo", description: "For serious learners",
    features: ["Unlimited course access", "Premium blockchain certificates", "Priority support", "Advanced analytics", "Direct mentoring sessions"],
    popular: true,
  },
  {
    name: "Enterprise", price: "Custom", currency: "", description: "For institutions and teams",
    features: ["Everything in Pro", "Custom integrations", "Team management dashboard", "Dedicated success manager", "White-label certificates"],
  },
]

const faqs = [
  { q: "How do blockchain certificates work?", a: "Certificates are minted as unique cryptographic assets on the Stellar network. Each certificate contains a hash of your achievements, making them tamper-proof and publicly verifiable by anyone — without needing to contact us." },
  { q: "What payment methods do you accept?", a: "We accept Stellar (XLM) and USDC stablecoin payments. Simply connect your Freighter or any Stellar wallet to pay. Transactions settle in 3-5 seconds with near-zero fees." },
  { q: "Can I get a refund?", a: "Yes, we offer a full 7-day refund policy on any course. Refunds are processed automatically back to your Stellar wallet." },
  { q: "Are courses self-paced?", a: "Every course is fully self-paced. Learn on your schedule with lifetime access to all purchased materials." },
  { q: "How do I become an instructor?", a: "Sign up as an instructor, create your course with our built-in authoring tools, and publish once approved. You receive payouts directly in XLM or USDC." },
]

const footerLinks = {
  Product: ["Courses", "Pricing", "Marketplace", "Certificates", "Verify"],
  Company: ["About", "Blog", "Careers", "Press", "Contact"],
  Resources: ["Help Center", "Documentation", "Community", "Status", "API"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <GraduationCap className="h-4 w-4 text-on-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-ink">DLearn</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-sm text-body hover:text-ink transition-colors">Pricing</Link>
            <Link href="/dashboard/marketplace" className="text-sm text-body hover:text-ink transition-colors">Courses</Link>
            <Link href="/verify" className="text-sm text-body hover:text-ink transition-colors">Verify</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-hairline px-6 py-4 space-y-3 bg-canvas">
            <Link href="/pricing" className="block text-sm text-body">Pricing</Link>
            <Link href="/dashboard/marketplace" className="block text-sm text-body">Courses</Link>
            <Link href="/verify" className="block text-sm text-body">Verify</Link>
            <div className="flex gap-3 pt-2">
              <Link href="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
              <Link href="/signup"><Button size="sm">Get Started</Button></Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section — Full-bleed dark band with layered cards */}
        <section className="relative overflow-hidden bg-surface-dark px-6 py-24 sm:py-32 lg:py-40">
          <div className="relative mx-auto max-w-7xl">
            <div className="lg:w-3/5">
              <Badge variant="blue" className="mb-6">Revolutionizing Education</Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-on-dark leading-none">
                Learn. <span className="text-primary">Earn.</span> Verify.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-on-dark-soft leading-relaxed">
                The first decentralized learning platform. Earn blockchain-verified certificates, 
                learn from top instructors worldwide, and advance your career — all powered by Stellar.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto text-base px-10 h-14">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard/marketplace">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-10 h-14 border-on-dark-soft text-on-dark hover:bg-surface-dark-elevated">
                    Browse Courses
                  </Button>
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-6 text-sm text-on-dark-soft">
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-semantic-up" /> Blockchain Verified</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-semantic-up" /> 10K+ Students</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-semantic-up" /> 500+ Courses</span>
              </div>
            </div>
            {/* Floating product-UI card mockup */}
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-96">
              <div className="rounded-xl bg-surface-dark-elevated p-6 border border-white/10 shadow-lg rotate-3 translate-x-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary/20" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 w-24 rounded-pill bg-white/20" />
                    <div className="h-2 w-16 rounded-pill bg-white/10" />
                  </div>
                  <div className="h-6 w-16 rounded-pill bg-semantic-up/20" />
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-full rounded-pill bg-white/10" />
                  <div className="h-2.5 w-3/4 rounded-pill bg-white/10" />
                  <div className="h-2.5 w-1/2 rounded-pill bg-white/10" />
                </div>
              </div>
              <div className="rounded-xl bg-surface-dark-elevated p-5 border border-white/10 shadow-sm -mt-4 ml-12 w-72">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-semantic-up/20" />
                  <div className="h-2.5 w-20 rounded-pill bg-white/20" />
                  <div className="flex-1" />
                  <Badge variant="success" className="text-[10px] px-2 py-0.5">Verified</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section — Light canvas */}
        <section className="section-padding px-6">
          <div className="container-main">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-4">Platform Features</Badge>
              <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-ink leading-tight">
                Everything you need to succeed
              </h2>
              <p className="mt-4 text-body max-w-2xl mx-auto">
                Our platform combines cutting-edge blockchain technology with world-class education.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <Card key={i} variant="elevated" className="p-8 hover:shadow-md transition-shadow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-bg mb-5">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink mb-2">{f.title}</h3>
                  <p className="text-sm text-body leading-relaxed">{f.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works — Soft gray band */}
        <section className="section-padding px-6 bg-surface-soft">
          <div className="container-main">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-4">Getting Started</Badge>
              <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-ink leading-tight">
                How it works
              </h2>
              <p className="mt-4 text-body">From enrollment to certification in five simple steps.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-bg text-primary text-lg font-semibold mb-4">
                    {s.num}
                  </div>
                  <h3 className="font-semibold text-ink mb-1.5">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials — Light canvas */}
        <section className="section-padding px-6">
          <div className="container-main">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-4">Testimonials</Badge>
              <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-ink leading-tight">
                What our students say
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Card key={i} variant="elevated" className="p-8">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-body mb-6 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-sm text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing — Soft gray band */}
        <section className="section-padding px-6 bg-surface-soft">
          <div className="container-main">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-4">Pricing</Badge>
              <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-ink leading-tight">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-body">Choose the plan that fits your learning goals.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {plans.map((plan, i) => (
                <Card key={i} variant={plan.popular ? "default" : "default"} className={cn("relative p-8 flex flex-col", plan.popular && "ring-2 ring-primary bg-surface-dark text-on-dark")}>
                  {plan.popular && (
                    <Badge variant="blue" className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                  )}
                  <h3 className={cn("text-xl font-semibold mb-1", plan.popular ? "text-on-dark" : "text-ink")}>{plan.name}</h3>
                  <p className={cn("text-sm mb-6", plan.popular ? "text-on-dark-soft" : "text-muted")}>{plan.description}</p>
                  <div className="mb-6">
                    <span className={cn("text-4xl font-normal", plan.popular ? "text-on-dark" : "text-ink")}>{plan.price}</span>
                    {plan.currency && <span className={cn("ml-1", plan.popular ? "text-on-dark-soft" : "text-muted")}>{plan.currency}</span>}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Check className={cn("h-4 w-4 shrink-0", plan.popular ? "text-semantic-up" : "text-semantic-up")} />
                        <span className={plan.popular ? "text-on-dark" : "text-body"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup">
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — Light canvas */}
        <section className="section-padding px-6">
          <div className="container-main max-w-3xl">
            <div className="text-center mb-16">
              <Badge variant="default" className="mb-4">FAQ</Badge>
              <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-ink leading-tight">
                Frequently asked questions
              </h2>
            </div>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-hairline overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left font-medium text-ink transition-colors hover:bg-surface-soft"
                  >
                    {faq.q}
                    <ChevronDown className={cn("h-4 w-4 text-muted transition-transform shrink-0 ml-4", openFaq === i && "rotate-180")} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-body leading-relaxed animate-fade-in border-t border-hairline">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Band — Dark */}
        <section className="section-padding px-6 bg-surface-dark">
          <div className="container-main max-w-4xl text-center">
            <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-on-dark leading-tight mb-4">
              Ready to transform your learning journey?
            </h2>
            <p className="text-lg text-on-dark-soft mb-10 max-w-2xl mx-auto">
              Join thousands of students earning verifiable, blockchain-powered credentials.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-on-primary text-primary hover:bg-zinc-100 text-base px-12 h-14">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline bg-surface-soft">
        <div className="container-main py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <GraduationCap className="h-4 w-4 text-on-primary" />
                </div>
                <span className="text-lg font-semibold text-ink">DLearn</span>
              </Link>
              <p className="text-sm text-muted">Decentralized education for the future.</p>
            </div>
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold text-sm text-ink mb-4">{category}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-muted hover:text-ink transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">&copy; 2024 DLearn. All rights reserved.</p>
            <p className="text-sm text-muted">Built on Stellar.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
