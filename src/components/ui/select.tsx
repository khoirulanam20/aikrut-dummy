import { createContext, useContext, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const SelectContext = createContext<{ value: string; onChange: (v: string) => void; open: boolean; setOpen: (v: boolean) => void } | null>(null)

function Select({ value, onValueChange, children, className }: { value?: string; onValueChange?: (v: string) => void; children: ReactNode; className?: string }) {
  const [internal, setInternal] = useState("")
  const [open, setOpen] = useState(false)
  const v = value ?? internal
  const setV = onValueChange ?? setInternal
  return (
    <SelectContext.Provider value={{ value: v, onChange: setV, open, setOpen }}>
      <div className={cn("relative", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className, children }: { className?: string; children?: ReactNode }) {
  const ctx = useContext(SelectContext)
  return (
    <button
      onClick={() => ctx?.setOpen(!ctx?.open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-pill border border-image-frame bg-canvas px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-cyan",
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 text-text-secondary" />
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = useContext(SelectContext)
  return <span>{ctx?.value || <span className="text-text-secondary">{placeholder}</span>}</span>
}

function SelectContent({ children, className }: { children?: ReactNode; className?: string }) {
  const ctx = useContext(SelectContext)
  if (!ctx?.open) return null
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => ctx.setOpen(false)} />
      <div
        className={cn(
          "absolute z-50 mt-1 w-full rounded-pill border border-image-frame bg-surface p-1 shadow-lg",
          className
        )}
      >
        {children}
      </div>
    </>
  )
}

function SelectItem({ value, children, className }: { value: string; children?: ReactNode; className?: string }) {
  const ctx = useContext(SelectContext)
  return (
    <div
      onClick={() => { ctx?.onChange(value); ctx?.setOpen(false) }}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-pill px-3 py-2 text-sm text-white hover:bg-surface-hover",
        ctx?.value === value && "bg-mint/10 text-mint",
        className
      )}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
