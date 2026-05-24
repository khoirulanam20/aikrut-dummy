import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { candidates, decisionTypes, type DecisionType } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BrainCircuit, CheckCircle2, AlertTriangle, MessageSquare, FileText } from "lucide-react"

export default function FinalDecision() {
  const { id } = useParams()
  const navigate = useNavigate()
  const candidate = candidates.find((c) => c.id === id)
  const [selectedDecision, setSelectedDecision] = useState<DecisionType | null>(candidate?.hrDecision ?? null)
  const [reason, setReason] = useState(candidate?.overrideReason ?? "")
  const [submitted, setSubmitted] = useState(false)

  if (!candidate || !candidate.competencyProfile) {
    return <div className="text-text-secondary">Kandidat tidak ditemukan atau profil belum tersedia</div>
  }

  const isOverride = !!(selectedDecision && selectedDecision !== candidate.aiRecommendation)
  const avgScore = (candidate.competencyProfile.scores.reduce((s, x) => s + x.blendedScore, 0) / candidate.competencyProfile.scores.length).toFixed(1)

  const handleSubmit = () => {
    if (selectedDecision && (isOverride ? reason.length >= 50 : true)) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <Link to="/batch" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-mint transition-colors">
          <ArrowLeft className="h-3 w-3" /> Kembali
        </Link>
        <Card className="bg-surface border-image-frame p-8 rounded-pill text-center max-w-lg mx-auto">
          <CheckCircle2 className="h-12 w-12 text-mint mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Keputusan Tersimpan</h2>
          <p className="text-text-secondary mb-1">
            Keputusan <strong className="text-white">{selectedDecision}</strong> untuk {candidate.name} telah dicatat.
          </p>
          <p className="text-xs text-text-secondary mb-6">Audit trail telah diperbarui</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/candidate/${candidate.id}`)} variant="outline" className="border-image-frame text-white hover:bg-surface-hover rounded-pill">
              Kembali ke Profil
            </Button>
            <Button onClick={() => navigate("/batch")} className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
              Ke Batch Assessment
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link to={`/candidate/${candidate.id}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-mint transition-colors">
        <ArrowLeft className="h-3 w-3" /> Kembali ke Profil
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white">Keputusan Akhir</h1>
        <p className="text-text-secondary text-sm mt-1">Review dan finalisasi keputusan untuk {candidate.name}</p>
      </div>

      <Card className="bg-surface border-image-frame p-5 rounded-pill">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-ultraviolet/20 flex items-center justify-center text-lg font-bold text-ultraviolet">
            {candidate.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-white">{candidate.name}</h2>
            <p className="text-sm text-text-secondary">{candidate.position} • {candidate.department}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-text-secondary">Rata-rata Skor</p>
            <p className="text-xl font-bold text-mint">{avgScore}</p>
          </div>
        </div>

        <div className="grid gap-2 mb-4">
          {candidate.competencyProfile.scores.map((s) => (
            <div key={s.competencyId} className="flex items-center gap-2 text-sm">
              <span className="w-32 text-text-secondary text-xs">{s.competencyName}</span>
              <Progress value={s.blendedScore * 20} className="flex-1 h-1.5 bg-canvas" />
              <span className="w-8 text-right font-mono text-white text-xs">{s.blendedScore.toFixed(1)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-canvas">
          <BrainCircuit className="h-4 w-4 text-ultraviolet" />
          <span className="text-sm text-text-secondary">Rekomendasi AI:</span>
          <Badge className={`text-xs ${
            candidate.aiRecommendation === "Promote" || candidate.aiRecommendation === "Hire"
              ? "bg-mint/10 text-mint" : "bg-yellow-400/10 text-yellow-400"
          }`}>
            {candidate.aiRecommendation}
          </Badge>
        </div>
      </Card>

      <Card className="bg-surface border-image-frame p-5 rounded-pill">
        <h2 className="font-bold text-white mb-4">Pilih Keputusan Anda</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {decisionTypes.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDecision(d)}
              className={`p-3 rounded-pill text-sm font-medium transition-all border ${
                selectedDecision === d
                  ? d === "Promote" || d === "Hire"
                    ? "bg-mint/20 border-mint text-mint"
                    : d === "Not Yet"
                    ? "bg-yellow-400/20 border-yellow-400 text-yellow-400"
                    : "bg-red-400/20 border-red-400 text-red-400"
                  : "bg-canvas border-image-frame text-text-secondary hover:border-text-secondary"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {isOverride && selectedDecision && (
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-400">Override AI Recommendation</p>
                <p className="text-xs text-text-secondary mt-1">
                  Anda akan memberikan keputusan berbeda dari rekomendasi AI. 
                  Wajib memberikan alasan minimal 50 karakter untuk audit trail.
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Alasan Override <span className="text-red-400">*</span></label>
              <Textarea
                placeholder="Jelaskan alasan Anda berbeda dengan rekomendasi AI..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 min-h-[100px]"
              />
              <p className={`text-xs mt-1 ${reason.length < 50 ? "text-red-400" : "text-mint"}`}>
                {reason.length}/50 karakter minimal
              </p>
            </div>
          </div>
        )}

        {selectedDecision && !isOverride && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-mint/10 border border-mint/30">
            <CheckCircle2 className="h-4 w-4 text-mint" />
            <p className="text-sm text-mint">Anda setuju dengan rekomendasi AI</p>
          </div>
        )}
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          onClick={() => navigate(`/candidate/${candidate.id}`)}
          variant="outline"
          className="border-image-frame text-white hover:bg-surface-hover rounded-pill"
        >
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedDecision || (isOverride && reason.length < 50)}
          className="bg-mint text-canvas hover:bg-mint/90 rounded-pill disabled:opacity-50"
        >
          Konfirmasi Keputusan
        </Button>
      </div>
    </div>
  )
}
