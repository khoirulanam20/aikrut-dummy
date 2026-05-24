import { useEffect, type ReactNode } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { usePortal } from "@/context/PortalContext"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BrainCircuit, Upload, MessageSquare, CheckCircle2, LogOut, Home, ChevronRight } from "lucide-react"

const steps = [
  { label: "Upload Evidence", path: "/portal/evidence", icon: Upload, key: "evidenceUploaded" as const },
  { label: "Sesi Roleplay", path: "/portal/roleplay", icon: MessageSquare, key: "roleplayCompleted" as const },
  { label: "Selesai", path: "/portal/selesai", icon: CheckCircle2, key: "" as const },
]

export default function PortalLayout() {
  const { user, progress, logout } = usePortal()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate("/portal", { replace: true })
  }, [user, navigate])

  if (!user) return null

  const completedCount = [progress.evidenceCompleted, progress.roleplayCompleted].filter(Boolean).length
  const totalSteps = 2
  const pct = Math.round((completedCount / totalSteps) * 100)

  const currentStepIndex = steps.findIndex((s) => location.pathname === s.path)

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-mint-dark/20 bg-surface/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/portal/dashboard" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ultraviolet">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">Aikrut</span>
              <ChevronRight className="h-3 w-3 text-text-secondary" />
              <span className="text-sm text-text-secondary">Portal Kandidat</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-ultraviolet/20 flex items-center justify-center text-xs font-bold text-ultraviolet">
                  {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs text-text-secondary hidden sm:inline">{user.name}</span>
              </div>
              <button onClick={() => { logout(); navigate("/portal") }} className="text-text-secondary hover:text-mint transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="pb-3">
            <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
              <Home className="h-3 w-3" />
              <Link to="/portal/dashboard" className="hover:text-white transition-colors">Beranda</Link>
              {currentStepIndex >= 0 && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-white">{steps[currentStepIndex].label}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Progress value={pct} className="flex-1 h-1.5 bg-canvas" />
              <span className="text-xs text-text-secondary whitespace-nowrap">{completedCount}/{totalSteps} selesai</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <nav className="flex gap-1 px-4 pt-3 overflow-x-auto">
          {steps.slice(0, 2).map((step, i) => {
            const active = location.pathname === step.path
            const done = step.key ? progress[step.key] : false
            const locked = i === 1 && !progress.evidenceCompleted
            return (
              <Link
                key={step.path}
                to={locked ? "#" : step.path}
                onClick={(e) => { if (locked) e.preventDefault() }}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-pill text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? "bg-surface text-white border-t border-l border-r border-image-frame"
                    : done
                    ? "bg-mint/10 text-mint"
                    : locked
                    ? "bg-canvas text-text-secondary/50 cursor-not-allowed"
                    : "bg-canvas text-text-secondary hover:text-white"
                }`}
              >
                <step.icon className="h-3.5 w-3.5" />
                {step.label}
                {done && <CheckCircle2 className="h-3 w-3 text-mint" />}
              </Link>
            )
          })}
          <Link
            to={progress.roleplayCompleted ? "/portal/selesai" : "#"}
            onClick={(e) => { if (!progress.roleplayCompleted) e.preventDefault() }}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-pill text-xs font-medium transition-all whitespace-nowrap ${
              location.pathname === "/portal/selesai"
                ? "bg-surface text-white border-t border-l border-r border-image-frame"
                : progress.roleplayCompleted
                ? "bg-mint/10 text-mint"
                : "bg-canvas text-text-secondary/50 cursor-not-allowed"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Selesai
          </Link>
        </nav>
      </div>

      <main className="max-w-4xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
