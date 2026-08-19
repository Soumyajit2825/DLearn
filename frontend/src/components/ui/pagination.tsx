"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

export function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }: PaginationProps) {
  if (totalPages <= 1) return null

  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const pages: (number | string)[] = []
  const totalPageNumbers = siblingCount * 2 + 5

  if (totalPages <= totalPageNumbers) {
    pages.push(...range(1, totalPages))
  } else {
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)
    const showLeftDots = leftSiblingIndex > 2
    const showRightDots = rightSiblingIndex < totalPages - 1

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      pages.push(...range(1, leftItemCount), "...", totalPages)
    } else if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      pages.push(1, "...", ...range(totalPages - rightItemCount + 1, totalPages))
    } else {
      pages.push(1, "...", ...range(leftSiblingIndex, rightSiblingIndex), "...", totalPages)
    }
  }

  return (
    <nav className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((page, idx) =>
        typeof page === "string" ? (
          <span key={`dots-${idx}`} className="px-2 text-sm text-zinc-400">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "ghost"}
            size="icon"
            onClick={() => onPageChange(page)}
            className={cn(
              "h-9 w-9 text-sm",
              page === currentPage
                ? "bg-primary text-white"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
            )}
          >
            {page}
          </Button>
        )
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
