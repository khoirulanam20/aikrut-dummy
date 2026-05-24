import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-canvas", className)} {...props}>
      <div
        className="h-full w-full flex-1 rounded-full bg-mint transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }
