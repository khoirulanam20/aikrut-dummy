import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { candidates, type DecisionType } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, ArrowUpDown, Download, BrainCircuit, TrendingUp, TrendingDown } from "lucide-react"

const allCompetencies = [
  "Technical Leadership",
  "Problem Solving",
  "Marketing Strategy",
  "Data-Driven Marketing",
  "Kepemimpinan",
  "Analisis Strategis",
  "Komunikasi",
  "Inovasi",
  "Integritas",
  "Kolaborasi",
]

export default function CandidateComparison() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [filterRec, setFilterRec] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")

  const completedCandidates = useMemo(() => {
    let filtered = candidates.filter((c) => c.status === "Completed" && c.competencyProfile)
    if (search) {
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (filterRec !== "all") {
      filtered = filtered.filter((c) => c.aiRecommendation === filterRec)
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
  }, [search, filterRec, sortBy])

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
        <Select value={filterRec} onValueChange={setFilterRec}>
          <SelectTrigger className="w-40 bg-surface border-image-frame text-white rounded-pill">
            <SelectValue placeholder="Rekomendasi" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-image-frame text-white">
            <SelectItem value="all">Semua</SelectItem>
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

      <Card className="bg-surface border-image-frame rounded-pill overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-image-frame hover:bg-transparent">
                <TableHead className="text-text-secondary font-medium">Kandidat</TableHead>
                <TableHead className="text-text-secondary font-medium">Rekomendasi AI</TableHead>
                {allCompetencies.map((comp) => (
                  <TableHead key={comp} className="text-text-secondary font-medium text-right whitespace-nowrap">{comp}</TableHead>
                ))}
                <TableHead className="text-text-secondary font-medium text-right">Rata-rata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedCandidates.map((c) => {
                const avg = c.competencyProfile
                  ? (c.competencyProfile.scores.reduce((s, x) => s + x.blendedScore, 0) / c.competencyProfile.scores.length).toFixed(1)
                  : "—"
                const scoresMap = new Map(
                  c.competencyProfile?.scores.map((s) => [s.competencyName, s.blendedScore]) ?? []
                )
                return (
                  <TableRow
                    key={c.id}
                    className="border-image-frame hover:bg-surface-hover cursor-pointer"
                    onClick={() => navigate(`/candidate/${c.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-ultraviolet/20 flex items-center justify-center text-xs font-bold text-ultraviolet">
                          {c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{c.name}</p>
                          <p className="text-[10px] text-text-secondary">{c.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${
                        c.aiRecommendation === "Promote" || c.aiRecommendation === "Hire"
                          ? "bg-mint/10 text-mint"
                          : c.aiRecommendation === "Not Yet"
                          ? "bg-yellow-400/10 text-yellow-400"
                          : "bg-red-400/10 text-red-400"
                      }`}>
                        {c.aiRecommendation}
                      </Badge>
                    </TableCell>
                    {allCompetencies.map((comp) => {
                      const score = scoresMap.get(comp)
                      return (
                        <TableCell key={comp} className="text-right">
                          {score !== undefined ? (
                            <span className="text-sm font-mono text-white">{score.toFixed(1)}</span>
                          ) : (
                            <span className="text-text-secondary text-xs">—</span>
                          )}
                        </TableCell>
                      )
                    })}
                    <TableCell className="text-right">
                      <span className="text-sm font-bold text-mint">{avg}</span>
                    </TableCell>
                  </TableRow>
                )
              })}
              {completedCandidates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={allCompetencies.length + 3} className="text-center text-text-secondary py-8">
                    Belum ada kandidat yang selesai assessment
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
