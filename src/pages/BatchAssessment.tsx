import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { batches as dummyBatches, candidates as dummyCandidates, frameworks, employees } from "@/data/dummy"
import type { BatchStatus, Batch } from "@/data/dummy"
import { useLocalStorage } from "@/hooks/use-local-storage"
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
import { Plus, Search, ArrowRight, GitBranch, Users, Calendar, Clock, CheckCircle2, Pencil } from "lucide-react"

const statusColors: Record<BatchStatus, string> = {
  Draft: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  Active: "bg-mint/10 text-mint border-mint/30",
  Completed: "bg-blue-400/10 text-blue-400 border-blue-400/30",
}

const departments = [...new Set(employees.map(e => e.department))]

export default function BatchAssessment() {
  const location = useLocation()
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [added, setAdded] = useLocalStorage<Batch[]>("aikrut_batches", dummyBatches)

  const [step, setStep] = useState(1)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", position: "", department: "", frameworkId: "", deadline: "" })
  const [assignMode, setAssignMode] = useState<"individual" | "department">("individual")
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([])
  const [empSearch, setEmpSearch] = useState("")
  const [empDeptFilter, setEmpDeptFilter] = useState("all")
  const [empCategoryFilter, setEmpCategoryFilter] = useState("all")

  useEffect(() => {
    const editId = (location.state as any)?.editBatchId
    if (editId) {
      const batch = added.find(b => b.id === editId)
      if (batch) openEdit(batch)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const filteredEmployees = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(empSearch.toLowerCase()) || e.nik.toLowerCase().includes(empSearch.toLowerCase())
    const matchDept = empDeptFilter === "all" || e.department === empDeptFilter
    const matchCategory = empCategoryFilter === "all" || e.category === empCategoryFilter
    return matchSearch && matchDept && matchCategory && e.status === "Active"
  })

  const filtered = added.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.position.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditingId(null)
    setForm({ name: "", position: "", department: "", frameworkId: "", deadline: "" })
    setSelectedEmployeeIds([])
    setAssignMode("individual")
    setStep(1)
    setEmpSearch("")
    setEmpDeptFilter("all")
    setShowCreate(true)
  }

  const openEdit = (batch: Batch) => {
    setEditingId(batch.id)
    setForm({
      name: batch.name,
      position: batch.position,
      department: batch.department,
      frameworkId: batch.frameworkId,
      deadline: batch.deadline,
    })
    setSelectedEmployeeIds(batch.assignedEmployeeIds || [])
    setAssignMode("individual")
    setStep(1)
    setEmpSearch("")
    setEmpDeptFilter("all")
    setShowCreate(true)
  }

  const handleNext = () => {
    if (!form.name || !form.position || !form.frameworkId) return
    if (form.department && assignMode === "individual") {
      const deptEmps = employees.filter(e => e.department === form.department && e.status === "Active")
      if (selectedEmployeeIds.length === 0) {
        setSelectedEmployeeIds(deptEmps.map(e => e.id))
      }
    }
    setStep(2)
  }

  const handleSubmit = () => {
    const fw = frameworks.find(f => f.id === form.frameworkId)
    let finalIds = selectedEmployeeIds
    if (assignMode === "department" && form.department) {
      finalIds = employees.filter(e => e.department === form.department && e.status === "Active").map(e => e.id)
    }
    if (editingId) {
      setAdded(prev => prev.map(b => {
        if (b.id !== editingId) return b
        return {
          ...b,
          name: form.name,
          position: form.position,
          department: form.department || "General",
          frameworkId: form.frameworkId,
          frameworkName: fw?.name || "",
          deadline: form.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
          candidateCount: finalIds.length,
          completedCount: 0,
          assignedEmployeeIds: finalIds,
        }
      }))
    } else {
      const batch: Batch = {
        id: `BATCH-${String(added.length + 1).padStart(3, "0")}`,
        name: form.name,
        position: form.position,
        department: form.department || "General",
        status: "Draft",
        frameworkId: form.frameworkId,
        frameworkName: fw?.name || "",
        deadline: form.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        candidateCount: finalIds.length,
        completedCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        createdBy: "Sari Dewi",
        assignedEmployeeIds: finalIds,
      }
      setAdded([batch, ...added])
    }
    setShowCreate(false)
    setStep(1)
    setForm({ name: "", position: "", department: "", frameworkId: "", deadline: "" })
    setSelectedEmployeeIds([])
    setAssignMode("individual")
    setEditingId(null)
  }

  const toggleEmployee = (id: string) => {
    setSelectedEmployeeIds(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
  }

  const selectAllEmployees = () => setSelectedEmployeeIds(filteredEmployees.map(e => e.id))
  const deselectAllEmployees = () => setSelectedEmployeeIds([])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Batch Assessment</h1>
          <p className="text-text-secondary text-sm mt-1">Kelola assessment batch dan assign kandidat</p>
        </div>
        <Button onClick={openCreate} className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
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
          const batchCandidates = dummyCandidates.filter((c) => c.batchId === batch.id)
          const completedCount = batchCandidates.filter((c) => c.status === "Completed").length
          const progress = batch.candidateCount > 0 ? Math.round((completedCount / batch.candidateCount) * 100) : 0

          return (
            <div key={batch.id} className="group relative">
              <Link to={`/batch/${batch.id}`} state={{ batch }}>
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
                        <p className="text-sm font-bold text-white">{completedCount}/{batch.candidateCount}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-text-secondary" />
                    </div>
                  </div>
                  <Progress value={progress} className="mt-3 h-1.5 bg-canvas" />
                </Card>
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); openEdit(batch) }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-surface border border-image-frame text-text-secondary opacity-0 group-hover:opacity-100 hover:text-mint hover:border-mint transition-all"
                title="Edit batch"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <Card className="bg-surface border-image-frame p-8 rounded-pill text-center">
            <GitBranch className="h-8 w-8 text-text-secondary mx-auto mb-2" />
            <p className="text-text-secondary">Tidak ada batch ditemukan</p>
          </Card>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={v => { if (!v) { setShowCreate(false); setStep(1); setEditingId(null); setForm({ name: "", position: "", department: "", frameworkId: "", deadline: "" }); setSelectedEmployeeIds([]); setAssignMode("individual") } }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Batch" : "Buat Batch Baru"}</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase mb-4">
            <span className={step === 1 ? "text-mint" : "text-text-secondary"}>1. Informasi Batch</span>
            <span className="text-text-secondary">→</span>
            <span className={step === 2 ? "text-mint" : "text-text-secondary"}>2. Assign Karyawan</span>
          </div>

          {step === 1 ? (
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
                <Button onClick={() => { setShowCreate(false); setEditingId(null) }} variant="outline" className="flex-1 border-image-frame text-white hover:bg-surface-hover rounded-pill">
                  Batal
                </Button>
                <Button onClick={handleNext} disabled={!form.name || !form.position || !form.frameworkId}
                  className="flex-1 bg-mint text-canvas hover:bg-mint/90 rounded-pill disabled:opacity-50">
                  Selanjutnya <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setAssignMode("individual")}
                  className={`px-3 py-1.5 text-xs rounded-pill font-mono tracking-wider uppercase transition-all ${assignMode === "individual" ? "bg-mint text-canvas" : "bg-surface text-text-secondary border border-image-frame hover:text-white"}`}>
                  Pilih Individu
                </button>
                <button onClick={() => setAssignMode("department")}
                  className={`px-3 py-1.5 text-xs rounded-pill font-mono tracking-wider uppercase transition-all ${assignMode === "department" ? "bg-mint text-canvas" : "bg-surface text-text-secondary border border-image-frame hover:text-white"}`}>
                  Assign Departemen
                </button>
              </div>

              {assignMode === "department" ? (
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Pilih Departemen</label>
                  <Select value={form.department} onValueChange={v => {
                    setForm({ ...form, department: v })
                    const deptEmps = employees.filter(e => e.department === v && e.status === "Active")
                    setSelectedEmployeeIds(deptEmps.map(e => e.id))
                  }}>
                    <SelectTrigger className="bg-canvas border-image-frame text-white rounded-pill">
                      <SelectValue placeholder="Pilih departemen" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-image-frame text-white">
                      {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {form.department && (
                    <p className="text-xs text-mint mt-2">
                      {employees.filter(e => e.department === form.department && e.status === "Active").length} karyawan aktif dari {form.department} akan di-assign
                    </p>
                  )}
                  {selectedEmployeeIds.length > 0 && (
                    <div className="mt-3 max-h-32 overflow-y-auto space-y-1">
                      {employees.filter(e => selectedEmployeeIds.includes(e.id)).map(emp => (
                        <div key={emp.id} className="flex items-center gap-2 p-1.5 rounded bg-canvas">
                          <div className="h-6 w-6 rounded-full bg-ultraviolet/20 flex items-center justify-center text-[9px] font-bold text-ultraviolet flex-shrink-0">
                            {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs text-white">{emp.name}</span>
                          <span className="text-[10px] text-text-secondary ml-auto">{emp.position}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex gap-2 mb-2">
                    <Input placeholder="Cari karyawan..." value={empSearch} onChange={e => setEmpSearch(e.target.value)}
                      className="flex-1 bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill text-xs" />
                    <Select value={empDeptFilter} onValueChange={setEmpDeptFilter}>
                      <SelectTrigger className="w-28 bg-canvas border-image-frame text-white rounded-pill text-xs">
                        <SelectValue placeholder="Dept" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-image-frame text-white">
                        <SelectItem value="all">Semua Dept</SelectItem>
                        {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={empCategoryFilter} onValueChange={setEmpCategoryFilter}>
                      <SelectTrigger className="w-32 bg-canvas border-image-frame text-white rounded-pill text-xs">
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-image-frame text-white">
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="existing">Existing</SelectItem>
                        <SelectItem value="recruitment">Rekrutmen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={selectAllEmployees} className="text-xs text-mint hover:underline">Pilih Semua</button>
                    <span className="text-text-secondary text-xs">/</span>
                    <button onClick={deselectAllEmployees} className="text-xs text-text-secondary hover:underline">Hapus Semua</button>
                    <span className="text-xs text-text-secondary ml-auto">{selectedEmployeeIds.length} terpilih</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredEmployees.map(emp => (
                      <label key={emp.id}
                        className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${selectedEmployeeIds.includes(emp.id) ? "bg-mint/10 border border-mint/30" : "bg-canvas border border-transparent hover:bg-surface"}`}>
                        <input type="checkbox" checked={selectedEmployeeIds.includes(emp.id)} onChange={() => toggleEmployee(emp.id)}
                          className="accent-mint h-4 w-4" />
                        <div className="h-7 w-7 rounded-full bg-ultraviolet/20 flex items-center justify-center text-[10px] font-bold text-ultraviolet flex-shrink-0">
                          {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{emp.name}</p>
                          <p className="text-[10px] text-text-secondary truncate">{emp.position} • {emp.department}</p>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono tracking-wider uppercase ${emp.category === "existing" ? "bg-blue-400/10 text-blue-400" : "bg-ultraviolet/10 text-ultraviolet"}`}>
                          {emp.category === "existing" ? "Existing" : "Rekrutmen"}
                        </span>
                      </label>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <p className="text-xs text-text-secondary text-center py-4">Tidak ada karyawan ditemukan</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-image-frame text-white hover:bg-surface-hover rounded-pill">
                  Kembali
                </Button>
                <Button onClick={handleSubmit} disabled={selectedEmployeeIds.length === 0}
                  className="flex-1 bg-mint text-canvas hover:bg-mint/90 rounded-pill disabled:opacity-50">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> {editingId ? "Simpan Perubahan" : "Buat Batch"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
