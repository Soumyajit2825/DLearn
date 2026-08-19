"use client"

import { useState, useEffect } from "react"
import { Search, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const allTransactions = Array.from({ length: 30 }).map((_, i) => ({
  id: `tx-${i + 1}`,
  from: i % 2 === 0 ? `user${i + 1}@example.com` : "platform",
  to: i % 2 === 0 ? "platform" : `user${i + 1}@example.com`,
  amount: `${Math.floor(Math.random() * 500 + 10)} XLM`,
  type: ["enrollment", "payout", "reward", "refund"][i % 4],
  status: i % 5 === 0 ? "failed" : "completed",
  date: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
}))

export default function AdminTransactionsPage() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const filtered = allTransactions.filter((t) => {
    if (search && !t.id.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-zinc-500 mt-1">Platform transaction history.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input placeholder="Search by hash..." className="pl-10 rounded-full" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <Card variant="elevated" className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                    <TableCell className="text-sm">{tx.from}</TableCell>
                    <TableCell className="text-sm">{tx.to}</TableCell>
                    <TableCell className="font-medium">{tx.amount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{tx.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.status === "completed" ? "success" : "danger"}>{tx.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-500">{tx.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </DashboardLayout>
  )
}
