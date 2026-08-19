"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingBag, Star, Filter, SlidersHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import api from "@/lib/api"
import type { Course } from "@/types"

const categories = ["All", "Blockchain", "Development", "DeFi", "Web3", "Design"]
const levels = ["All", "Beginner", "Intermediate", "Advanced"]
const sortOptions = ["Popular", "Newest", "Price: Low to High", "Price: High to Low", "Rating"]

interface CourseCard {
  id: string
  title: string
  instructor: string
  price: number
  rating: string
  students: number
  level: string
  category: string
  image: null
}

export default function MarketplacePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allCourses, setAllCourses] = useState<CourseCard[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [level, setLevel] = useState("All")
  const [sort, setSort] = useState("Popular")
  const [page, setPage] = useState(1)
  const pageSize = 9

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get<Course[]>("/courses?published=true")
        setAllCourses(
          res.map((c) => ({
            id: c.id,
            title: c.title,
            instructor: c.instructor?.full_name ?? "Unknown",
            price: c.price,
            rating: c.rating.toFixed(1),
            students: c.enrolled_count,
            level: c.level,
            category: c.category,
            image: null,
          }))
        )
      } catch (err: any) {
        setError(err.message ?? "Failed to load courses")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  let filtered = allCourses.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false
    if (category !== "All" && c.category !== category) return false
    if (level !== "All" && c.level !== level) return false
    return true
  })

  if (sort === "Price: Low to High") filtered.sort((a, b) => a.price - b.price)
  else if (sort === "Price: High to Low") filtered.sort((a, b) => b.price - a.price)
  else if (sort === "Rating") filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-zinc-500 mt-1">Discover courses from top instructors.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input placeholder="Search courses..." className="pl-10 rounded-full" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1) }}>
            <SelectTrigger className="w-full sm:w-40 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={level} onValueChange={(v) => { setLevel(v); setPage(1) }}>
            <SelectTrigger className="w-full sm:w-40 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>{levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-44 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>{sortOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} variant="elevated" className="p-0 overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-zinc-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((course) => (
                <Link key={course.id} href={`/dashboard/marketplace/${course.id}`}>
                  <Card variant="elevated" className="p-0 overflow-hidden hover:shadow-md transition-all group">
                    <div className="h-40 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-white/20" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{course.level}</Badge>
                        <Badge variant="blue">{course.category}</Badge>
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-sm text-zinc-500 mt-1">{course.instructor}</p>
                      <div className="flex items-center gap-3 mt-3 text-sm">
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {course.rating}</span>
                        <span className="text-zinc-400">{course.students} students</span>
                      </div>
                      <div className="mt-4">
                        {course.price === 0 ? (
                          <Badge variant="success">Free</Badge>
                        ) : (
                          <span className="text-lg font-bold">{course.price} XLM</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
