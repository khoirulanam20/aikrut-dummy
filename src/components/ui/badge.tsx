import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const variants = {
  default: "border-transparent bg-mint/20 text-mint",
  secondary: "border-transparent bg-surface text-text-secondary",
  destructive: "border-transparent bg-red-500/20 text-red-400",
  outline: "text-white border-image-frame",
}

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
