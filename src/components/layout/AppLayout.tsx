import { Outlet } from "react-router-dom"
import { AppSidebar } from "./AppSidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-canvas overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
