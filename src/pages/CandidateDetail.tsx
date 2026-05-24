import { useParams, Link } from "react-router-dom"
import { candidates, evidenceFiles, roleplaySessions, type CompetencyScore } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BrainCircuit, FileText, MessageSquare, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react"

function ScoreCard({ score }: { score: CompetencyScore }) {
  const gapIcon = score.gap < 0 ? <TrendingUp className="h-3 w-3 text-mint" /> : score.gap > 0 ? <TrendingDown className="h-3 w-3 text-red-400" /> : <Minus className="h-3 w-3 text-text-secondary" />
  const gapColor = score.gap < 0 ? "text-mint" : score.gap > 0 ? "text-red-400" : "text-text-secondary"

  return (
    <Card className="bg-canvas border-image-frame p-4 rounded-pill">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-white">{score.competencyName}</h4>
        <div className="flex items-center gap-1 text-xs">
          {gapIcon}
          <span className={gapColor}>Gap: {score.gap > 0 ? "+" : ""}{score.gap.toFixed(1)}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-text-secondary mb-1">
            <span>Evidence</span>
            <span>{score.evidenceScore.toFixed(1)}</span>
          </div>
          <Progress value={score.evidenceScore * 20} className="h-1.5 bg-surface" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-text-secondary mb-1">
            <span>Roleplay</span>
            <span>{score.roleplayScore.toFixed(1)}</span>
          </div>
          <Progress value={score.roleplayScore * 20} className="h-1.5 bg-surface" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-white">{score.blendedScore.toFixed(1)}</span>
        <span className="text-[10px] text-text-secondary">
          Confidence: {Math.round(score.confidence * 100)}%
        </span>
      </div>
      <p className="text-xs text-text-secondary mt-2 leading-relaxed">{score.justification}</p>
      {score.evidenceExcerpt && (
        <div className="mt-2 p-2 rounded-lg bg-ultraviolet/10 border border-ultraviolet-dark/30">
          <p className="text-[10px] text-ultraviolet font-medium mb-0.5">Evidence Excerpt:</p>
          <p className="text-[10px] text-text-secondary italic">{score.evidenceExcerpt}</p>
        </div>
      )}
    </Card>
  )
}

export default function CandidateDetail() {
  const { id } = useParams()
  const candidate = candidates.find((c) => c.id === id)
  if (!candidate) return <div className="text-text-secondary">Kandidat tidak ditemukan</div>

  const files = evidenceFiles.filter((f) => f.candidateId === candidate.id)
  const sessions = roleplaySessions.filter((s) => s.candidateId === candidate.id)

  return (
    <div className="space-y-6">
      <Link to="/batch" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-mint transition-colors">
        <ArrowLeft className="h-3 w-3" /> Kembali ke Batch
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-ultraviolet/20 flex items-center justify-center text-xl font-bold text-ultraviolet">
            {candidate.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{candidate.name}</h1>
            <p className="text-text-secondary">{candidate.position} • {candidate.department}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`text-[10px] ${
                candidate.status === "Completed" ? "bg-mint/10 text-mint" : "bg-yellow-400/10 text-yellow-400"
              }`}>
                {candidate.status}
              </Badge>
              {candidate.aiRecommendation && (
                <Badge className={`text-[10px] ${
                  candidate.aiRecommendation === "Promote" || candidate.aiRecommendation === "Hire"
                    ? "bg-mint/10 text-mint" : "bg-yellow-400/10 text-yellow-400"
                }`}>
                  AI: {candidate.aiRecommendation}
                </Badge>
              )}
              {candidate.hrDecision && (
                <Badge className="text-[10px] bg-blue-400/10 text-blue-400">
                  HR: {candidate.hrDecision}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {candidate.status === "Completed" && (
          <Link to={`/candidate/${candidate.id}/decision`}>
            <Button className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
              Keputusan Akhir
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        )}
      </div>

      <Tabs value="profile" className="space-y-4">
        <TabsList className="bg-surface border-image-frame rounded-pill">
          <TabsTrigger value="profile" className="data-[state=active]:bg-mint data-[state=active]:text-canvas rounded-pill">
            <BrainCircuit className="h-4 w-4 mr-1" /> Profil Kompetensi
          </TabsTrigger>
          <TabsTrigger value="evidence" className="data-[state=active]:bg-mint data-[state=active]:text-canvas rounded-pill">
            <FileText className="h-4 w-4 mr-1" /> Evidence ({files.length})
          </TabsTrigger>
          <TabsTrigger value="roleplay" className="data-[state=active]:bg-mint data-[state=active]:text-canvas rounded-pill">
            <MessageSquare className="h-4 w-4 mr-1" /> Roleplay ({sessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          {candidate.competencyProfile ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {candidate.competencyProfile.scores.map((s) => (
                  <ScoreCard key={s.competencyId} score={s} />
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span>Blended at: {candidate.competencyProfile.blendedAt}</span>
                {candidate.competencyProfile.snapshot && (
                  <Badge variant="outline" className="text-[10px] border-mint/30 text-mint">Immutable Snapshot</Badge>
                )}
              </div>
            </>
          ) : (
            <Card className="bg-surface border-image-frame p-8 rounded-pill text-center">
              <BrainCircuit className="h-8 w-8 text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary">Profil kompetensi belum tersedia</p>
              <p className="text-xs text-text-secondary mt-1">Kandidat masih dalam proses assessment</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="evidence" className="space-y-3">
          {files.length > 0 ? files.map((f) => (
            <Card key={f.id} className="bg-surface border-image-frame p-4 rounded-pill flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-ultraviolet" />
                <div>
                  <p className="text-sm font-medium text-white">{f.name}</p>
                  <p className="text-xs text-text-secondary">{f.type} • {f.size} • {f.uploadedAt}</p>
                </div>
              </div>
              <Badge className={`text-[10px] ${
                f.status === "completed" ? "bg-mint/10 text-mint" :
                f.status === "processing" ? "bg-yellow-400/10 text-yellow-400" : "bg-surface text-text-secondary"
              }`}>
                {f.status}
              </Badge>
            </Card>
          )) : (
            <Card className="bg-surface border-image-frame p-8 rounded-pill text-center">
              <FileText className="h-8 w-8 text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary">Belum ada evidence diupload</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roleplay" className="space-y-3">
          {sessions.length > 0 ? sessions.map((s) => (
            <Card key={s.id} className="bg-surface border-image-frame p-4 rounded-pill">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-mint" />
                  <h3 className="font-medium text-white text-sm">Sesi Roleplay</h3>
                </div>
                <Badge className="bg-mint/10 text-mint text-[10px]">{s.status}</Badge>
              </div>
              <p className="text-sm text-text-secondary mb-3 italic">"{s.scenario}"</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {s.messages.slice(0, 4).map((m) => (
                  <div key={m.id} className={`p-2 rounded-xl text-xs ${
                    m.sender === "ai" ? "bg-canvas mr-8" : "bg-ultraviolet/10 ml-8"
                  }`}>
                    <p className="font-medium text-text-muted mb-0.5">{m.sender === "ai" ? "AI Persona" : "Kandidat"}</p>
                    <p className="text-white">{m.content}</p>
                  </div>
                ))}
                {s.messages.length > 4 && (
                  <p className="text-xs text-text-secondary text-center pt-1">...dan {s.messages.length - 4} pesan lainnya</p>
                )}
              </div>
            </Card>
          )) : (
            <Card className="bg-surface border-image-frame p-8 rounded-pill text-center">
              <MessageSquare className="h-8 w-8 text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary">Belum ada sesi roleplay</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
