import { createContext, useContext, useState, forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type SidebarContextType = {
  open: boolean
  setOpen: (v: boolean) => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | null>(null)

function SidebarProvider({ children, defaultOpen = true }: { children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const isMobile = useMobile()
  return (
    <SidebarContext.Provider value={{ open, setOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

function Sidebar({ children, className }: { children?: ReactNode; className?: string }) {
  const ctx = useContext(SidebarContext)
  if (!ctx) return null
  return (
    <>
      {ctx.isMobile && ctx.open && (
        <div className="fixed inset-0 z-40 bg-black/60" onClick={() => ctx.setOpen(false)} />
      )}
      <aside
        className={cn(
          "flex flex-col border-r border-mint-dark/20 bg-canvas text-white transition-all duration-300",
          ctx.isMobile
            ? "fixed inset-y-0 left-0 z-50 w-64"
            : "relative w-64",
          !ctx.open && !ctx.isMobile && "w-0 overflow-hidden border-0",
          ctx.isMobile && !ctx.open && "-translate-x-full",
          className
        )}
      >
        {children}
      </aside>
    </>
  )
}

const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-14 items-center border-b border-mint-dark/20 px-4", className)} {...props} />
  )
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 overflow-auto py-2", className)} {...props} />
  )
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-t border-mint-dark/20", className)} {...props} />
  )
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-3 py-2", className)} {...props} />
  )
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-1 px-2 text-xs font-medium text-text-secondary", className)} {...props} />
  )
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-0.5", className)} {...props} />
  )
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />
)
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean
  asChild?: boolean
}

const SidebarMenuButton = forwardRef<HTMLDivElement, SidebarMenuButtonProps>(
  ({ className, isActive, children, asChild, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-pill px-3 py-2 text-sm font-medium text-text-secondary transition-all hover:bg-surface-hover hover:text-white cursor-pointer",
        isActive && "bg-mint/10 text-mint hover:bg-mint/15 hover:text-mint",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
SidebarMenuButton.displayName = "SidebarMenuButton"

function SidebarInset({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <main className={cn("flex-1 overflow-auto", className)}>
      {children}
    </main>
  )
}

function SidebarTrigger() {
  const ctx = useContext(SidebarContext)
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => ctx?.setOpen(!ctx?.open)}
      className="text-text-secondary hover:text-white"
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
}
