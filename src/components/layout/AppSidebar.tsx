import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  GitBranch,
  BarChart3,
  Shield,
  FileText,
  UserCheck,
  LogOut,
  BrainCircuit,
  ContactRound,
} from "lucide-react"

const menuGroups = [
  {
    label: "Utama",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: GitBranch, label: "Batch Assessment", path: "/batch" },
      { icon: ContactRound, label: "Data Employee", path: "/employees" },
      { icon: BarChart3, label: "Perbandingan Kandidat", path: "/comparison" },
    ],
  },
  {
    label: "Pengaturan",
    items: [
      { icon: FileText, label: "Framework Kompetensi", path: "/framework" },
    ],
  },
  {
    label: "Admin",
    items: [
      { icon: Users, label: "Manajemen Pengguna", path: "/admin/users" },
      { icon: Shield, label: "Audit Log", path: "/admin/audit" },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-mint-dark/20 px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint">
            <BrainCircuit className="h-5 w-5 text-canvas" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Aikrut
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-text-secondary text-xs uppercase tracking-wider">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/")
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link to={item.path} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupLabel className="text-text-secondary text-xs uppercase tracking-wider">
            Portal Kandidat
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/portal" className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4" />
                    <span>Portal Kandidat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-mint-dark/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-ultraviolet flex items-center justify-center text-xs font-bold text-white">
              SD
            </div>
            <div className="text-xs">
              <p className="text-white font-medium">Sari Dewi</p>
              <p className="text-text-secondary">HR/Admin</p>
            </div>
          </div>
          <Link to="/login" className="text-text-secondary hover:text-mint transition-colors">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
