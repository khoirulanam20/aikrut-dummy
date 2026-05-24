import { useState } from "react"
import { Link } from "react-router-dom"
import { batches, candidates, frameworks, employees } from "@/data/dummy"
import type { BatchStatus, Batch } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Plus, Search, ArrowRight, GitBranch, Users, Calendar, Clock, CheckCircle2, X } from "lucide-react"

const statusColors: Record<BatchStatus, string> = {
  Draft: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  Active: "bg-mint/10 text-mint border-mint/30",
  Completed: "bg-blue-400/10 text-blue-400 border-blue-400/30",
}

const departments = [...new Set(employees.map(e => e.department))]

export default function BatchAssessment() {
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [added, setAdded] = useState<Batch[]>(batches)
  const [form, setForm] = useState({ name: "", position: "", department: "", frameworkId: "", deadline: "" })

  const filtered = added.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.position.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    if (!form.name || !form.position || !form.frameworkId) return
    const fw = frameworks.find(f => f.id === form.frameworkId)
    const batch: Batch = {
      id: `BATCH-${String(added.length + 1).padStart(3, "0")}`,
      name: form.name,
      position: form.position,
      department: form.department || "General",
      status: "Draft",
      frameworkId: form.frameworkId,
      frameworkName: fw?.name || "",
      deadline: form.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      candidateCount: 0,
      completedCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "Sari Dewi",
    }
    setAdded([batch, ...added])
    setShowCreate(false)
    setForm({ name: "", position: "", department: "", frameworkId: "", deadline: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Batch Assessment</h1>
          <p className="text-text-secondary text-sm mt-1">Kelola assessment batch dan assign kandidat</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
          <Plus className="h-4 w-4 mr-2" /> Buat Batch
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        <Input
          placeholder="Cari batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-surface border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((batch) => {
          const batchCandidates = candidates.filter((c) => c.batchId === batch.id)
          const completedCount = batchCandidates.filter((c) => c.status === "Completed").length
          const progress = batchCandidates.length > 0 ? Math.round((completedCount / batchCandidates.length) * 100) : 0

          return (
            <Link key={batch.id} to={`/batch/${batch.id}`}>
              <Card className="bg-surface border-image-frame p-5 rounded-pill hover:bg-surface-hover transition-all cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{batch.name}</h3>
                      <Badge className={`text-[10px] border ${statusColors[batch.status]}`}>
                        {batch.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary">{batch.position} • {batch.department}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {batch.candidateCount} kandidat
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Deadline: {batch.deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {batch.createdAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-text-secondary">Progress</p>
                      <p className="text-sm font-bold text-white">{completedCount}/{batchCandidates.length}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-text-secondary" />
                  </div>
                </div>
                <Progress value={progress} className="mt-3 h-1.5 bg-canvas" />
              </Card>
            </Link>
          )
        })}
        {filtered.length === 0 && (
          <Card className="bg-surface border-image-frame p-8 rounded-pill text-center">
            <GitBranch className="h-8 w-8 text-text-secondary mx-auto mb-2" />
            <p className="text-text-secondary">Tidak ada batch ditemukan</p>
          </Card>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Batch Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Nama Batch *</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Assessment Manager Engineering" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Posisi Target *</label>
                <Input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
                  placeholder="Manager Engineering" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Departemen</label>
                <Select value={form.department} onValueChange={v => setForm({ ...form, department: v })}>
                  <SelectTrigger className="bg-canvas border-image-frame text-white rounded-pill">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-image-frame text-white">
                    {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Framework Kompetensi *</label>
              <Select value={form.frameworkId} onValueChange={v => setForm({ ...form, frameworkId: v })}>
                <SelectTrigger className="bg-canvas border-image-frame text-white rounded-pill">
                  <SelectValue placeholder="Pilih framework" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-image-frame text-white">
                  {frameworks.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Deadline</label>
              <Input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="bg-canvas border-image-frame text-white rounded-pill [color-scheme:dark]" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowCreate(false)} variant="outline" className="flex-1 border-image-frame text-white hover:bg-surface-hover rounded-pill">
                Batal
              </Button>
              <Button onClick={handleCreate} disabled={!form.name || !form.position || !form.frameworkId}
                className="flex-1 bg-mint text-canvas hover:bg-mint/90 rounded-pill disabled:opacity-50">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Buat Batch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
