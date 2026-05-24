import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, GitBranch, ContactRound, BarChart3, MoreHorizontal, Users, FileText, Building2, Briefcase, Layers, Shield, UserCheck, BrainCircuit, X } from "lucide-react"

const mainNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: GitBranch, label: "Batch", path: "/batch" },
  { icon: ContactRound, label: "Employee", path: "/employees" },
  { icon: BarChart3, label: "Bandingkan", path: "/comparison" },
]

const moreItems = [
  { icon: FileText, label: "Framework Kompetensi", path: "/framework" },
  { icon: Building2, label: "Master Departemen", path: "/master/departemen" },
  { icon: Briefcase, label: "Master Posisi", path: "/master/posisi" },
  { icon: Layers, label: "Master Level", path: "/master/level" },
  { icon: Users, label: "Manajemen Pengguna", path: "/admin/users" },
  { icon: Shield, label: "Audit Log", path: "/admin/audit" },
  { icon: UserCheck, label: "Portal Kandidat", path: "/portal" },
]

export function BottomNav() {
  const location = useLocation()
  const [showMore, setShowMore] = useState(false)

  const isActive = (path: string) => {
    if (path === "/batch") return location.pathname.startsWith("/batch")
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-canvas border-t border-white/10 safe-area-bottom md:hidden">
        <div className="flex items-center justify-around h-14">
          {mainNav.map(item => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full transition-colors ${
                  active ? "text-mint" : "text-text-secondary hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[9px] font-mono tracking-wider uppercase leading-tight">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => setShowMore(true)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full transition-colors ${
              showMore ? "text-mint" : "text-text-secondary hover:text-white"
            }`}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[9px] font-mono tracking-wider uppercase leading-tight">Lainnya</span>
          </button>
        </div>
      </nav>

      {showMore && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowMore(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl border-t border-white/10 max-h-[70vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-sm font-bold text-white">Menu Lainnya</span>
              <button onClick={() => setShowMore(false)} className="text-text-secondary hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-2 space-y-0.5">
              <Link
                to="/dashboard"
                onClick={() => setShowMore(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-pill transition-colors ${
                  location.pathname === "/dashboard" ? "bg-mint/10 text-mint" : "text-text-secondary hover:text-white hover:bg-surface-hover"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
              {moreItems.map(item => {
                const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/")
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-pill transition-colors ${
                      active ? "bg-mint/10 text-mint" : "text-text-secondary hover:text-white hover:bg-surface-hover"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="px-4 py-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-ultraviolet flex items-center justify-center text-[10px] font-bold text-white">
                  SD
                </div>
                <div className="text-xs">
                  <p className="text-white font-medium">Sari Dewi</p>
                  <p className="text-text-secondary">HR/Admin</p>
                </div>
                <Link to="/login" className="ml-auto text-text-secondary hover:text-mint transition-colors">
                  <span className="text-xs font-mono tracking-wider uppercase">Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
