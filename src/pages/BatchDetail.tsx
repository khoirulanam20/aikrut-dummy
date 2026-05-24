import { useParams, Link } from "react-router-dom"
import { batches, candidates, evidenceFiles } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, Calendar, Clock, FileText, BrainCircuit, ChevronRight } from "lucide-react"

const statusStyles: Record<string, string> = {
  Menunggu: "bg-yellow-400/10 text-yellow-400",
  Uploading: "bg-blue-400/10 text-blue-400",
  Roleplay: "bg-purple-400/10 text-purple-400",
  Processing: "bg-orange-400/10 text-orange-400",
  Completed: "bg-mint/10 text-mint",
}

export default function BatchDetail() {
  const { id } = useParams()
  const batch = batches.find((b) => b.id === id)
  if (!batch) return <div className="text-text-secondary">Batch tidak ditemukan</div>

  const batchCandidates = candidates.filter((c) => c.batchId === batch.id)
  const completedCount = batchCandidates.filter((c) => c.status === "Completed").length

  return (
    <div className="space-y-6">
      <Link to="/batch" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-mint transition-colors">
        <ArrowLeft className="h-3 w-3" /> Kembali
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{batch.name}</h1>
            <Badge className={`text-xs ${batch.status === "Active" ? "bg-mint/10 text-mint" : batch.status === "Draft" ? "bg-yellow-400/10 text-yellow-400" : "bg-blue-400/10 text-blue-400"}`}>
              {batch.status}
            </Badge>
          </div>
          <p className="text-text-secondary mt-1">{batch.position} • {batch.department}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {batch.candidateCount} Kandidat</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Deadline: {batch.deadline}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Dibuat: {batch.createdAt}</span>
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> Framework: {batch.frameworkName}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary">Progress</p>
          <p className="text-lg font-bold text-white">{completedCount}/{batch.candidateCount}</p>
        </div>
      </div>

      <Progress value={batchCandidates.length > 0 ? (completedCount / batchCandidates.length) * 100 : 0} className="h-2 bg-canvas" />

      <div className="grid gap-3">
        {batchCandidates.map((c) => {
          const files = evidenceFiles.filter((f) => f.candidateId === c.id)
          return (
            <Link key={c.id} to={`/candidate/${c.id}`}>
              <Card className="bg-surface border-image-frame p-4 rounded-pill hover:bg-surface-hover transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-ultraviolet/20 flex items-center justify-center text-sm font-bold text-ultraviolet">
                      {c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">{c.name}</p>
                      <p className="text-xs text-text-secondary">
                        {c.position} {c.isExternal ? "(Eksternal)" : ""} • {files.length} file
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`text-[10px] border-0 ${statusStyles[c.status] || ""}`}>
                      {c.status}
                    </Badge>
                    {c.aiRecommendation && (
                      <Badge className={`text-[10px] border-0 ${
                        c.aiRecommendation === "Promote" || c.aiRecommendation === "Hire"
                          ? "bg-mint/10 text-mint"
                          : "bg-yellow-400/10 text-yellow-400"
                      }`}>
                        {c.aiRecommendation}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-text-secondary" />
                  </div>
                </div>
                {c.competencyProfile && (
                  <div className="mt-3 flex gap-2">
                    {c.competencyProfile.scores.map((s) => (
                      <div key={s.competencyId} className="flex items-center gap-1 text-[10px] bg-canvas rounded px-2 py-1">
                        <BrainCircuit className="h-3 w-3 text-mint" />
                        <span className="text-text-secondary">{s.competencyName}: </span>
                        <span className="text-white font-medium">{s.blendedScore.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
