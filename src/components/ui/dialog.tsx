import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"

function Dialog({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (v: boolean) => void; children?: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={() => onOpenChange?.(false)} />
      <div className="relative z-50 w-full max-w-lg rounded-pill bg-surface border border-image-frame p-6">
        {children}
      </div>
    </div>
  )
}

const DialogContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />
)
DialogContent.displayName = "DialogContent"

const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("mb-4", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn("text-lg font-bold text-white", className)} {...props} />
)
DialogTitle.displayName = "DialogTitle"

export { Dialog, DialogContent, DialogHeader, DialogTitle }
