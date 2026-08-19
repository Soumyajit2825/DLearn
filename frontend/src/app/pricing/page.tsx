"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, ArrowRight, GraduationCap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free", price: 0, period: "forever",
    description: "Get started with basic access",
    features: ["5 courses access", "Basic blockchain certificates", "Community forum access", "Course previews", "Email support"],
    highlighted: false,
  },
  {
    name: "Pro", price: 50, period: "month",
    description: "For serious learners",
    features: ["Unlimited courses", "Premium blockchain certificates", "Priority support", "Advanced analytics", "Direct mentoring", "Downloadable resources", "Early access to new courses"],
    highlighted: true,
  },
  {
    name: "Enterprise", price: null, period: "custom",
    description: "For institutions and teams",
    features: ["Everything in Pro", "Custom integrations", "Team management dashboard", "Dedicated account manager", "White-label certificates", "Custom branding", "API access", "SLA guarantee"],
    highlighted: false,
  },
]

const comparisonFeatures = [
  { name: "Course access", free: "5 courses", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Certificate type", free: "Basic", pro: "Premium", enterprise: "White-label" },
  { name: "Blockchain verification", free: true, pro: true, enterprise: true },
  { name: "Community access", free: true, pro: true, enterprise: true },
  { name: "Email support", free: true, pro: "Priority", enterprise: "Dedicated" },
  { name: "Analytics", free: false, pro: "Advanced", enterprise: "Custom" },
  { name: "Mentoring", free: false, pro: true, enterprise: true },
  { name: "API access", free: false, pro: false, enterprise: true },
  { name: "Custom branding", free: false, pro: false, enterprise: true },
]

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <GraduationCap className="h-4 w-4 text-on-primary" />
            </div>
            <span className="text-lg font-semibold text-ink">DLearn</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-body hover:text-ink transition-colors">Pricing</Link>
            <Link href="/dashboard/marketplace" className="text-sm text-body hover:text-ink transition-colors">Courses</Link>
            <Link href="/verify" className="text-sm text-body hover:text-ink transition-colors">Verify</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link href="/signup"><Button size="sm">Get Started</Button></Link>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>
      </header>

      <main className="px-6 py-24">
        <div className="container-main">
          <div className="text-center mb-16">
            <Badge variant="blue" className="mb-4">Pricing</Badge>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight text-ink mb-4 leading-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-muted max-w-2xl mx-auto mb-8">
              Choose the plan that fits your learning needs. All plans include blockchain-verified certificates.
            </p>
            <div className="inline-flex items-center gap-3 rounded-pill bg-surface-strong p-1">
              <button
                onClick={() => setYearly(false)}
                className={cn("rounded-pill px-5 py-2 text-sm font-medium transition-all", !yearly && "bg-canvas shadow-sm")}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={cn("rounded-pill px-5 py-2 text-sm font-medium transition-all", yearly && "bg-canvas shadow-sm")}
              >
                Yearly <span className="text-semantic-up ml-1">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mb-24">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                variant={plan.highlighted ? "dark" : "default"}
                className={cn("relative p-8 flex flex-col", plan.highlighted && "scale-105")}
              >
                {plan.highlighted && (
                  <Badge variant="blue" className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                )}
                <div className="mb-6">
                  <h3 className={cn("text-xl font-semibold mb-1", plan.highlighted ? "text-on-dark" : "text-ink")}>{plan.name}</h3>
                  <p className={cn("text-sm", plan.highlighted ? "text-on-dark-soft" : "text-muted")}>{plan.description}</p>
                  <div className={cn("flex items-baseline gap-1 mt-4", plan.highlighted ? "text-on-dark" : "text-ink")}>
                    {plan.price !== null ? (
                      <>
                        <span className="text-4xl font-normal">
                          {yearly ? Math.round(plan.price * 12 * 0.8) : plan.price}
                        </span>
                        <span className={cn("ml-1 text-sm", plan.highlighted ? "text-on-dark-soft" : "text-muted")}>
                          {plan.period === "month" ? (yearly ? "XLM/year" : "XLM/month") : plan.period}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-normal">Custom</span>
                    )}
                  </div>
                  {yearly && plan.price !== null && plan.price > 0 && (
                    <p className="text-xs text-semantic-up mt-1">Save 20% with annual billing</p>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className={cn("h-4 w-4 mt-0.5 shrink-0", plan.highlighted ? "text-semantic-up" : "text-semantic-up")} />
                      <span className={plan.highlighted ? "text-on-dark" : "text-body"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                  <Button className="w-full" variant={plan.highlighted ? "default" : "outline"} size="lg">
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                    {plan.name !== "Enterprise" && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-center text-ink mb-8">Compare plans</h2>
            <div className="rounded-xl border border-hairline overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-surface-soft">
                    <th className="text-left px-6 py-4 font-medium text-ink">Feature</th>
                    <th className="px-6 py-4 font-medium text-center text-ink">Free</th>
                    <th className="px-6 py-4 font-medium text-center text-ink">Pro</th>
                    <th className="px-6 py-4 font-medium text-center text-ink">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, i) => (
                    <tr key={i} className="border-b border-hairline last:border-0">
                      <td className="px-6 py-4 text-body">{feature.name}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof feature.free === "boolean" ? (
                          feature.free ? <Check className="h-4 w-4 text-semantic-up mx-auto" /> : <span className="text-muted-soft">-</span>
                        ) : (
                          <span className="text-muted">{feature.free}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof feature.pro === "boolean" ? (
                          feature.pro ? <Check className="h-4 w-4 text-semantic-up mx-auto" /> : <span className="text-muted-soft">-</span>
                        ) : (
                          <span className="text-muted">{feature.pro}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof feature.enterprise === "boolean" ? (
                          feature.enterprise ? <Check className="h-4 w-4 text-semantic-up mx-auto" /> : <span className="text-muted-soft">-</span>
                        ) : (
                          <span className="text-muted">{feature.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-hairline bg-surface-soft">
        <div className="container-main py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">&copy; 2024 DLearn. All rights reserved.</p>
            <p className="text-sm text-muted">Powered by Stellar blockchain.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
