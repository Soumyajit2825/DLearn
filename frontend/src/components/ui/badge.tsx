import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-strong text-ink",
        secondary: "bg-canvas text-muted border border-hairline",
        success: "text-semantic-up bg-[#e6f7ed] dark:bg-[#0a2e1a]",
        warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        danger: "text-semantic-down bg-[#fde8ea] dark:bg-[#2e0a0d]",
        blue: "bg-primary-bg text-primary dark:bg-primary-bg-dark dark:text-primary-text-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
