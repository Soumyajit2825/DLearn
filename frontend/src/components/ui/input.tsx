import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-md border px-4 py-3 text-sm transition-all duration-200",
            "bg-canvas",
            "border-hairline",
            "placeholder:text-muted-soft",
            "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-semantic-down focus:border-semantic-down focus:ring-semantic-down",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-semantic-down">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
