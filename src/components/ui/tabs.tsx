import { createContext, useContext, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const TabsContext = createContext<{ value: string; onChange: (v: string) => void } | null>(null)

function Tabs({ value, onValueChange, children, className }: {
  value?: string
  onValueChange?: (v: string) => void
  children?: ReactNode
  className?: string
}) {
  const [internal, setInternal] = useState("")
  const v = value ?? internal
  const setV = onValueChange ?? setInternal
  return (
    <TabsContext.Provider value={{ value: v, onChange: setV }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-1 p-1", className)}>
      {children}
    </div>
  )
}

function TabsTrigger({ value, children, className }: { value: string; children?: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  return (
    <button
      onClick={() => ctx?.onChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
        ctx?.value === value ? "bg-mint text-canvas" : "text-text-secondary hover:text-white",
        className
      )}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, children, className }: { value: string; children?: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  if (ctx?.value !== value) return null
  return <div className={className}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
