import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

function Sheet({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (v: boolean) => void; children?: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={() => onOpenChange?.(false)} />
      <div className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-full border-r border-image-frame bg-surface shadow-lg">
        <div className="relative flex w-full flex-col">
          <button
            onClick={() => onOpenChange?.(false)}
            className="absolute right-4 top-4 text-text-secondary hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

function SheetContent({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>
}

function SheetHeader({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>
}

function SheetTitle({ children, className }: { children?: ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-bold text-white", className)}>{children}</h2>
}

export { Sheet, SheetContent, SheetHeader, SheetTitle }
