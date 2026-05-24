import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const variants = {
  default: "bg-mint text-canvas hover:bg-mint/90",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-image-frame text-white hover:bg-surface-hover",
  secondary: "bg-surface text-white hover:bg-surface-hover",
  ghost: "hover:bg-surface-hover text-white",
  link: "text-mint underline-offset-4 hover:underline",
}

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3 text-xs",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-cyan disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
