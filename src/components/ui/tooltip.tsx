import { createContext, useContext, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const TooltipContext = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null)

function TooltipProvider({ children, delayDuration = 700 }: { children: ReactNode; delayDuration?: number }) {
  return <>{children}</>
}

function Tooltip({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({ children, asChild, className }: { children: ReactNode; asChild?: boolean; className?: string }) {
  return <div className={cn("inline-block", className)}>{children}</div>
}

function TooltipContent({ children, className, side = "top" }: { children: ReactNode; className?: string; side?: string }) {
  const ctx = useContext(TooltipContext)
  if (!ctx?.open) return null
  return (
    <div className={cn(
      "absolute z-50 rounded-md border border-image-frame bg-surface px-3 py-1.5 text-xs text-white shadow-md",
      side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
      side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
      className
    )}>
      {children}
    </div>
  )
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
