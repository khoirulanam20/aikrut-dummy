import { createContext, useContext, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const DropdownContext = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null)

function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

function DropdownMenuTrigger({ children, asChild, className }: { children: ReactNode; asChild?: boolean; className?: string }) {
  const ctx = useContext(DropdownContext)
  return (
    <div onClick={() => ctx?.setOpen(!ctx?.open)} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  )
}

function DropdownMenuContent({ children, className, align = "start" }: { children: ReactNode; className?: string; align?: string }) {
  const ctx = useContext(DropdownContext)
  if (!ctx?.open) return null
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => ctx.setOpen(false)} />
      <div className={cn(
        "absolute z-50 mt-1 min-w-[8rem] rounded-pill border border-image-frame bg-surface p-1 shadow-lg",
        align === "end" ? "right-0" : "left-0",
        className
      )}>
        {children}
      </div>
    </>
  )
}

function DropdownMenuItem({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const ctx = useContext(DropdownContext)
  return (
    <div
      onClick={() => { ctx?.setOpen(false); onClick?.() }}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-pill px-3 py-2 text-sm text-white hover:bg-surface-hover",
        className
      )}
    >
      {children}
    </div>
  )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
