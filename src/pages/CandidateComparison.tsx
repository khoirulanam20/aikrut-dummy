import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { candidates, batches } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowUpDown, Download, BrainCircuit, ChevronRight } from "lucide-react"

function recommendationStyle(rec?: string) {
  if (rec === "Promote" || rec === "Hire") return "bg-mint/10 text-mint"
  if (rec === "Not Yet") return "bg-yellow-400/10 text-yellow-400"
  return "bg-red-400/10 text-red-400"
}

export default function CandidateComparison() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [filterRec, setFilterRec] = useState<string>("all")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [filterBatch, setFilterBatch] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")

  const baseCompleted = useMemo(
    () => candidates.filter((c) => c.status === "Completed" && c.competencyProfile),
    []
  )

  const batchOptions = useMemo(() => {
    const batchIds = new Set(baseCompleted.map((c) => c.batchId))
    return batches.filter((b) => batchIds.has(b.id))
  }, [baseCompleted])

  const departments = useMemo(
    () => [...new Set(baseCompleted.map((c) => c.department))].sort(),
    [baseCompleted]
  )

  const completedCandidates = useMemo(() => {
    let filtered = [...baseCompleted]
    if (search) {
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (filterRec !== "all") {
      filtered = filtered.filter((c) => c.aiRecommendation === filterRec)
    }
    if (filterDepartment !== "all") {
      filtered = filtered.filter((c) => c.department === filterDepartment)
    }
    if (filterBatch !== "all") {
      filtered = filtered.filter((c) => c.batchId === filterBatch)
    }
    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "score") {
        const aAvg = a.competencyProfile?.scores.reduce((s, x) => s + x.blendedScore, 0) ?? 0
        const bAvg = b.competencyProfile?.scores.reduce((s, x) => s + x.blendedScore, 0) ?? 0
        return bAvg - aAvg
      }
      return 0
    })
    return filtered
  }, [baseCompleted, search, filterRec, filterDepartment, filterBatch, sortBy])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Perbandingan Kandidat</h1>
        <p className="text-text-secondary text-sm mt-1">Side-by-side comparison skor kompetensi per kandidat</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            placeholder="Cari kandidat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-surface border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill"
          />
        </div>
        <Select value={filterBatch} onValueChange={setFilterBatch}>
          <SelectTrigger className="w-52 bg-surface border-image-frame text-white rounded-pill">
            <SelectValue placeholder="Batch Assessment" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-image-frame text-white">
            <SelectItem value="all">Semua Batch</SelectItem>
            {batchOptions.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-44 bg-surface border-image-frame text-white rounded-pill">
            <SelectValue placeholder="Departemen" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-image-frame text-white">
            <SelectItem value="all">Semua Departemen</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterRec} onValueChange={setFilterRec}>
          <SelectTrigger className="w-40 bg-surface border-image-frame text-white rounded-pill">
            <SelectValue placeholder="Rekomendasi" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-image-frame text-white">
            <SelectItem value="all">Semua Rekomendasi</SelectItem>
            <SelectItem value="Promote">Promote</SelectItem>
            <SelectItem value="Not Yet">Not Yet</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Hire">Hire</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setSortBy(sortBy === "name" ? "score" : "name")} className="border-image-frame text-white hover:bg-surface-hover rounded-pill">
          <ArrowUpDown className="h-4 w-4 mr-1" />
          {sortBy === "name" ? "Nama" : "Skor"}
        </Button>
        <Button variant="outline" className="border-image-frame text-white hover:bg-surface-hover rounded-pill">
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
      </div>

      {completedCandidates.length === 0 ? (
        <Card className="bg-surface border-image-frame p-12 rounded-pill text-center">
          <BrainCircuit className="h-10 w-10 text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">
            {filterBatch !== "all" || filterDepartment !== "all" || filterRec !== "all" || search
              ? "Tidak ada kandidat yang cocok dengan filter"
              : "Belum ada kandidat yang selesai assessment"}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {completedCandidates.map((c) => {
            const scores = c.competencyProfile?.scores ?? []
            const avg = scores.length > 0
              ? scores.reduce((s, x) => s + x.blendedScore, 0) / scores.length
              : 0
            const batchName = batches.find((b) => b.id === c.batchId)?.name

            return (
              <Card
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/candidate/${c.id}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/candidate/${c.id}`)}
                className="bg-surface border-image-frame p-5 rounded-pill hover:bg-surface-hover hover:border-mint/20 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-full bg-ultraviolet/20 flex items-center justify-center text-sm font-bold text-ultraviolet flex-shrink-0">
                      {c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{c.name}</p>
                      <p className="text-xs text-text-secondary truncate">{c.position} • {c.department}</p>
                      {batchName && (
                        <p className="text-[10px] text-ultraviolet truncate mt-0.5">{batchName}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-secondary group-hover:text-mint shrink-0 mt-1 transition-colors" />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <Badge className={`text-[10px] border-0 ${recommendationStyle(c.aiRecommendation)}`}>
                    AI: {c.aiRecommendation}
                  </Badge>
                  <div className="text-right">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">Rata-rata</p>
                    <p className="text-xl font-bold text-mint">{avg.toFixed(1)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider flex items-center gap-1">
                    <BrainCircuit className="h-3 w-3" /> Skor Kompetensi
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {scores.map((s) => (
                      <div
                        key={s.competencyId}
                        className="flex items-center justify-between gap-3 text-[10px] bg-canvas rounded-lg px-2.5 py-1.5 min-w-[calc(50%-4px)] flex-1"
                      >
                        <span className="text-text-secondary truncate">{s.competencyName}</span>
                        <span className="text-white font-mono font-medium shrink-0">{s.blendedScore.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {c.hrDecision && (
                  <div className="mt-3 pt-3 border-t border-image-frame">
                    <Badge className="text-[10px] bg-blue-400/10 text-blue-400 border-0">
                      HR: {c.hrDecision}
                    </Badge>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {completedCandidates.length > 0 && (
        <p className="text-xs text-text-secondary text-center">
          Menampilkan {completedCandidates.length} kandidat • Klik card untuk detail lengkap
        </p>
      )}
    </div>
  )
}
