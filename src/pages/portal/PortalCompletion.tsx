import { useNavigate } from "react-router-dom"
import { usePortal } from "@/context/PortalContext"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2, FileText, MessageSquare,
  BarChart3, Mail, ArrowRight, Home, Shield,
} from "lucide-react"

const profileScores = [
  { name: "Kepemimpinan", evidenceScore: 3.5, roleplayScore: 3.8, blended: 3.7, confidence: 85 },
  { name: "Problem Solving", evidenceScore: 4.0, roleplayScore: 4.2, blended: 4.1, confidence: 92 },
  { name: "Komunikasi", evidenceScore: 3.5, roleplayScore: 3.8, blended: 3.7, confidence: 88 },
  { name: "Inovasi", evidenceScore: 3.0, roleplayScore: 3.5, blended: 3.3, confidence: 78 },
  { name: "Integritas", evidenceScore: 4.0, roleplayScore: 4.0, blended: 4.0, confidence: 95 },
  { name: "Kolaborasi", evidenceScore: 3.8, roleplayScore: 4.0, blended: 3.9, confidence: 90 },
]

export default function PortalCompletion() {
  const navigate = useNavigate()
  const { user, progress } = usePortal()

  if (!user) return null

  const avgBlended = profileScores.reduce((s, x) => s + x.blended, 0) / profileScores.length

  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-br from-mint/10 via-surface to-ultraviolet/10 border-mint/30 p-6 rounded-pill text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-mint/20 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-mint" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">Assessment Selesai!</h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Terima kasih, {user.name.split(" ")[0]}! Anda telah menyelesaikan seluruh tahapan assessment.
          Data Anda sedang diproses oleh tim HR.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3 text-mint" /> Evidence
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3 text-mint" /> Roleplay
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-mint" /> Selesai
          </span>
        </div>
      </Card>

      <Card className="bg-surface border-image-frame p-5 rounded-pill">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-mint" />
          Ringkasan Profil Kompetensi
        </h2>
        <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-canvas">
          <div>
            <p className="text-xs text-text-secondary">Rata-rata Skor</p>
            <p className="text-2xl font-bold text-mint">{avgBlended.toFixed(1)}</p>
            <p className="text-[10px] text-text-secondary">dari 5.0</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-secondary">Blended Weight</p>
            <p className="text-sm text-white">40% Evidence + 60% Roleplay</p>
            <Badge className="bg-mint/10 text-mint text-[10px] border-0 mt-1">
              <Shield className="h-3 w-3 mr-0.5" /> Immutable Snapshot
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          {profileScores.map((s) => (
            <div key={s.name} className="flex items-center gap-3 p-2 rounded-xl bg-canvas">
              <div className="w-24 flex-shrink-0">
                <p className="text-xs text-white font-medium">{s.name}</p>
              </div>
              <Progress value={s.blended * 20} className="flex-1 h-1.5 bg-surface" />
              <div className="flex items-center gap-2 w-24 justify-end flex-shrink-0">
                <span className="text-[10px] text-text-secondary">E:{s.evidenceScore.toFixed(1)}</span>
                <span className="text-[10px] text-text-secondary">R:{s.roleplayScore.toFixed(1)}</span>
                <span className="text-xs font-bold text-mint w-6 text-right">{s.blended.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-surface border-image-frame p-5 rounded-pill">
        <h2 className="text-sm font-bold text-white mb-3">Alur Selanjutnya</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-7 w-7 rounded-full bg-ultraviolet/20 flex items-center justify-center text-xs font-bold text-ultraviolet flex-shrink-0">1</div>
            <div>
              <p className="text-sm font-medium text-white">Review oleh HR</p>
              <p className="text-xs text-text-secondary">Tim HR akan mereview profil kompetensi Anda bersama dengan kandidat lain dalam batch yang sama.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-7 w-7 rounded-full bg-ultraviolet/20 flex items-center justify-center text-xs font-bold text-ultraviolet flex-shrink-0">2</div>
            <div>
              <p className="text-sm font-medium text-white">Keputusan Akhir</p>
              <p className="text-xs text-text-secondary">HR akan memutuskan apakah Anda direkomendasikan untuk promosi/posisi target berdasarkan profil kompetensi dan rekomendasi AI.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-7 w-7 rounded-full bg-ultraviolet/20 flex items-center justify-center text-xs font-bold text-ultraviolet flex-shrink-0">3</div>
            <div>
              <p className="text-sm font-medium text-white">Notifikasi Hasil</p>
              <p className="text-xs text-text-secondary">Anda akan menerima notifikasi email setelah keputusan final dirilis. Proses ini biasanya memakan waktu 5-7 hari kerja.</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-surface border-image-frame p-5 rounded-pill">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-mint/10 mt-0.5">
            <Mail className="h-5 w-5 text-mint" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white mb-1">Pantau Email Anda</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Hasil final assessment akan dikirimkan ke <strong className="text-white">{user.email}</strong>. 
              Pastikan Anda memeriksa kotak masuk (inbox) dan folder spam secara berkala.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => navigate("/portal/dashboard")}
          variant="outline"
          className="flex-1 border-image-frame text-white hover:bg-surface-hover rounded-pill"
        >
          <Home className="h-4 w-4 mr-1" /> Dashboard
        </Button>
        <Button
          onClick={() => { window.location.href = "/portal" }}
          className="flex-1 bg-ultraviolet text-white hover:bg-ultraviolet/90 rounded-pill"
        >
          Tutup <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
