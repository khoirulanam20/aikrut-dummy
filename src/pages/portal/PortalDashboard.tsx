import { Link } from "react-router-dom"
import { usePortal } from "@/context/PortalContext"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload, MessageSquare, CheckCircle2, Clock, FileText,
  BrainCircuit, Calendar, UserCheck, ArrowRight, Shield,
} from "lucide-react"

export default function PortalDashboard() {
  const { user, progress, setEvidenceCompleted } = usePortal()

  if (!user) return null

  const tasks = [
    {
      icon: Upload,
      label: "Upload Evidence",
      desc: "Upload CV, sertifikat, dan dokumen pendukung",
      status: progress.evidenceCompleted ? "completed" : progress.evidenceUploaded ? "in_progress" : "pending",
      path: "/portal/evidence",
      action: progress.evidenceCompleted ? "Lihat File" : progress.evidenceUploaded ? "Lanjutkan" : "Mulai Upload",
    },
    {
      icon: MessageSquare,
      label: "Sesi Roleplay",
      desc: "Simulasi interaktif dengan AI persona",
      status: progress.roleplayCompleted ? "completed" : progress.evidenceCompleted ? "ready" : "locked",
      path: progress.evidenceCompleted ? "/portal/roleplay" : "#",
      action: progress.roleplayCompleted ? "Lihat Hasil" : "Mulai Roleplay",
    },
  ]

  const completedCount = [progress.evidenceCompleted, progress.roleplayCompleted].filter(Boolean).length

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-ultraviolet/20 to-surface border-ultraviolet/30 p-6 rounded-pill">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white">Halo, {user.name.split(" ")[0]}!</h1>
              <Badge className="bg-mint/10 text-mint text-[10px] border-0">Kandidat</Badge>
            </div>
            <p className="text-sm text-text-secondary">
              Selamat datang di portal assessment Aikrut. Silakan selesaikan tahapan assessment di bawah ini.
            </p>
          </div>
          <div className="hidden sm:flex h-14 w-14 rounded-full bg-mint/20 items-center justify-center">
            <UserCheck className="h-7 w-7 text-mint" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-canvas/50 rounded-xl p-3">
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Assessment</p>
            <p className="text-sm font-medium text-white mt-0.5">{user.assessmentName}</p>
          </div>
          <div className="bg-canvas/50 rounded-xl p-3">
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Posisi</p>
            <p className="text-sm font-medium text-white mt-0.5">{user.position}</p>
          </div>
          <div className="bg-canvas/50 rounded-xl p-3">
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Departemen</p>
            <p className="text-sm font-medium text-white mt-0.5">{user.department}</p>
          </div>
          <div className="bg-canvas/50 rounded-xl p-3">
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Deadline</p>
            <p className="text-sm font-medium text-white mt-0.5">{user.deadline}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-surface border-image-frame p-4 rounded-pill">
          <div className="flex items-center gap-2 text-mint mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Progress</span>
          </div>
          <p className="text-2xl font-bold text-white">{completedCount}/2</p>
          <p className="text-xs text-text-secondary">Tahapan selesai</p>
          <Progress value={(completedCount / 2) * 100} className="mt-2 h-1.5 bg-canvas" />
        </Card>

        <Card className="bg-surface border-image-frame p-4 rounded-pill">
          <div className="flex items-center gap-2 text-ultraviolet mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Deadline</span>
          </div>
          <p className="text-lg font-bold text-white">{user.deadline}</p>
          <p className="text-xs text-text-secondary">Sisa 26 hari</p>
        </Card>

        <Card className="bg-surface border-image-frame p-4 rounded-pill">
          <div className="flex items-center gap-2 text-yellow-400 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Estimasi Waktu</span>
          </div>
          <p className="text-lg font-bold text-white">30-45 Menit</p>
          <p className="text-xs text-text-secondary">Total durasi assessment</p>
        </Card>
      </div>

      <h2 className="text-lg font-bold text-white mt-2">Tahapan Assessment</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task, i) => {
          const isLocked = task.status === "locked"
          const isCompleted = task.status === "completed"
          const isInProgress = task.status === "in_progress"

          return (
            <Link
              key={task.label}
              to={isLocked ? "#" : task.path}
              onClick={(e) => { if (isLocked) e.preventDefault() }}
              className={`block ${isLocked ? "cursor-not-allowed" : ""}`}
            >
              <Card className={`p-5 rounded-pill transition-all ${
                isCompleted
                  ? "bg-surface border-mint/30 hover:bg-surface-hover"
                  : isLocked
                  ? "bg-surface/50 border-image-frame opacity-60"
                  : "bg-surface border-image-frame hover:bg-surface-hover"
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    isCompleted ? "bg-mint/10" : isLocked ? "bg-canvas" : "bg-ultraviolet/10"
                  }`}>
                    <task.icon className={`h-6 w-6 ${
                      isCompleted ? "text-mint" : isLocked ? "text-text-secondary" : "text-ultraviolet"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{task.label}</h3>
                      {isCompleted && (
                        <Badge className="bg-mint/10 text-mint text-[10px] border-0">
                          <CheckCircle2 className="h-3 w-3 mr-0.5" /> Selesai
                        </Badge>
                      )}
                      {isLocked && (
                        <Badge className="bg-yellow-400/10 text-yellow-400 text-[10px] border-0">
                          <Clock className="h-3 w-3 mr-0.5" /> Terkunci
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{task.desc}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-xs font-medium ${
                        isCompleted ? "text-mint" : isLocked ? "text-text-secondary" : "text-ultraviolet"
                      }`}>
                        {task.action}
                      </span>
                      <ArrowRight className={`h-3 w-3 ${
                        isCompleted ? "text-mint" : isLocked ? "text-text-secondary" : "text-ultraviolet"
                      }`} />
                    </div>
                  </div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? "bg-mint/20 text-mint"
                      : isInProgress
                      ? "bg-yellow-400/20 text-yellow-400"
                      : isLocked
                      ? "bg-canvas text-text-secondary"
                      : "bg-ultraviolet/20 text-ultraviolet"
                  }`}>
                    {isCompleted ? "✓" : isInProgress ? "..." : i + 1}
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card className="bg-surface border-image-frame p-5 rounded-pill">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-mint/10 mt-0.5">
            <Shield className="h-4 w-4 text-mint" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Informasi Penting</h3>
            <ul className="space-y-1 text-xs text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-mint mt-0.5">•</span>
                Pastikan koneksi internet Anda stabil selama mengerjakan assessment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-mint mt-0.5">•</span>
                Anda dapat mengupload file PDF, DOCX, JPG, PNG (max 10MB per file)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-mint mt-0.5">•</span>
                Sesi roleplay akan disimulasikan dengan AI persona selama 15-20 menit
              </li>
              <li className="flex items-start gap-2">
                <span className="text-mint mt-0.5">•</span>
                Hasil assessment akan diproses setelah semua tahapan selesai
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
