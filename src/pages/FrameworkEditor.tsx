import { useState } from "react"
import { frameworks, type Framework, type Competency } from "@/data/dummy"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus, Copy, Eye, GripVertical, ChevronDown, ChevronUp, CheckCircle2, BookTemplate, X, Trash2, BrainCircuit, Pencil,
} from "lucide-react"
import type { LevelDescriptor } from "@/data/dummy"

const DEFAULT_LEVEL_LABELS = ["Pemula", "Dasar", "Madya", "Lanjut", "Ahli"]
const MIN_LEVELS = 2
const MAX_LEVELS = 7

type LevelForm = { label: string; indicator: string }

function createDefaultLevelForms(): LevelForm[] {
  return DEFAULT_LEVEL_LABELS.map((label) => ({ label, indicator: "" }))
}

const levelBadgeClass =
  "bg-mint text-canvas font-bold text-[10px] border-0 min-w-[4rem] justify-center shadow-[0_0_12px_rgba(60,255,208,0.25)]"

function todayISO() {
  return new Date().toISOString().split("T")[0]
}

function cloneFramework(source: Framework, name: string): Framework {
  const stamp = Date.now()
  return {
    id: `FW-${stamp}`,
    name,
    isTemplate: false,
    createdAt: todayISO(),
    updatedAt: todayISO(),
    competencies: source.competencies.map((c, i) => ({
      ...c,
      id: `COMP-${stamp}-${i}`,
      levels: c.levels.map((l) => ({ ...l })),
    })),
  }
}

function PreviewLevelRow({ level }: { level: LevelDescriptor }) {
  return (
    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-canvas border border-image-frame">
      <Badge className={`mt-0.5 shrink-0 ${levelBadgeClass}`}>Level {level.level}</Badge>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{level.label}</p>
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{level.indicator}</p>
      </div>
    </div>
  )
}

function CompetencyCard({ competency, onDelete }: { competency: Competency; onDelete?: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="bg-canvas border-image-frame rounded-pill overflow-hidden">
      <div className="w-full p-4 flex items-center justify-between hover:bg-surface-hover transition-colors">
        <div className="flex items-center gap-3 flex-1" onClick={() => setExpanded(!expanded)}>
          <GripVertical className="h-4 w-4 text-text-secondary cursor-grab" />
          <div className="text-left">
            <h4 className="text-sm font-medium text-white">{competency.name}</h4>
            <p className="text-xs text-text-secondary">{competency.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] border-image-frame text-text-secondary">
            {competency.levels.length} Levels
          </Badge>
          {onDelete && (
            <button onClick={onDelete} className="text-text-secondary hover:text-red-400 transition-colors p-1">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4 text-text-secondary" /> : <ChevronDown className="h-4 w-4 text-text-secondary" />}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {competency.levels.map((l) => (
            <div key={l.level} className="flex items-start gap-3 p-2 rounded-xl bg-surface">
              <Badge className={`mt-0.5 ${levelBadgeClass}`}>
                Level {l.level}
              </Badge>
              <div>
                <p className="text-xs font-medium text-white">{l.label}</p>
                <p className="text-[10px] text-text-secondary">{l.indicator}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function FrameworkEditor() {
  const [fwList, setFwList] = useLocalStorage<Framework[]>("aikrut_frameworks", frameworks)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddFw, setShowAddFw] = useState(false)
  const [editingFwId, setEditingFwId] = useState<string | null>(null)
  const [showAddComp, setShowAddComp] = useState(false)
  const [fwForm, setFwForm] = useState({ name: "", description: "" })
  const [compForm, setCompForm] = useState({ name: "", description: "" })
  const [levelForms, setLevelForms] = useState<LevelForm[]>(createDefaultLevelForms)
  const [previewFw, setPreviewFw] = useState<Framework | null>(null)
  const [cloneSource, setCloneSource] = useState<Framework | null>(null)
  const [cloneName, setCloneName] = useState("")
  const [notice, setNotice] = useState<string | null>(null)

  const expandedFw = fwList.find((f) => f.id === expandedId)

  const showNotice = (message: string) => {
    setNotice(message)
    setTimeout(() => setNotice(null), 4000)
  }

  const openClone = (fw: Framework) => {
    setCloneSource(fw)
    setCloneName(`${fw.name} (Salinan)`)
  }

  const handleConfirmClone = () => {
    if (!cloneSource || !cloneName.trim()) return
    const cloned = cloneFramework(cloneSource, cloneName.trim())
    setFwList((prev) => [...prev, cloned])
    setExpandedId(cloned.id)
    setCloneSource(null)
    setCloneName("")
    showNotice(`Framework "${cloned.name}" berhasil di-clone`)
  }

  const resetCompForm = () => {
    setCompForm({ name: "", description: "" })
    setLevelForms(createDefaultLevelForms())
  }

  const updateLevelForm = (index: number, field: keyof LevelForm, value: string) => {
    setLevelForms((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)))
  }

  const addLevel = () => {
    if (levelForms.length >= MAX_LEVELS) return
    setLevelForms((prev) => [...prev, { label: "", indicator: "" }])
  }

  const removeLevel = (index: number) => {
    if (levelForms.length <= MIN_LEVELS) return
    setLevelForms((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddFramework = () => {
    if (!fwForm.name) return
    const fw: Framework = {
      id: `FW-${String(fwList.length + 1).padStart(3, "0")}`,
      name: fwForm.name,
      isTemplate: false,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      competencies: [],
    }
    setFwList([...fwList, fw])
    setExpandedId(fw.id)
    setShowAddFw(false)
    setFwForm({ name: "", description: "" })
  }

  const openEditFramework = (fw: Framework) => {
    setEditingFwId(fw.id)
    setFwForm({ name: fw.name, description: "" })
  }

  const handleSaveEditFramework = () => {
    if (!editingFwId || !fwForm.name.trim()) return
    setFwList((prev) =>
      prev.map((f) =>
        f.id === editingFwId
          ? { ...f, name: fwForm.name.trim(), updatedAt: todayISO() }
          : f
      )
    )
    setEditingFwId(null)
    setFwForm({ name: "", description: "" })
    showNotice("Framework berhasil diperbarui")
  }

  const handleDeleteFramework = (fw: Framework) => {
    if (!confirm(`Hapus framework "${fw.name}"? Semua kompetensi di dalamnya akan ikut terhapus.`)) return
    const next = fwList.filter((f) => f.id !== fw.id)
    setFwList(next)
    if (expandedId === fw.id) setExpandedId(next[0]?.id ?? null)
    showNotice(`Framework "${fw.name}" dihapus`)
  }

  const toggleFramework = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const handleAddCompetency = () => {
    if (!compForm.name || !expandedFw) return
    const validLevels = levelForms.filter((l) => l.label.trim())
    if (validLevels.length === 0) return

    const comp: Competency = {
      id: `COMP-${String(Date.now()).slice(-4)}`,
      name: compForm.name,
      description: compForm.description,
      levels: levelForms.map((lf, i) => ({
        level: i + 1,
        label: lf.label.trim() || `Level ${i + 1}`,
        indicator: lf.indicator.trim() || `Indikator perilaku untuk level ${i + 1} — ${compForm.name}`,
      })),
    }
    setFwList(prev => prev.map(f => f.id === expandedFw.id
      ? { ...f, competencies: [...f.competencies, comp], updatedAt: todayISO() }
      : f
    ))
    setShowAddComp(false)
    resetCompForm()
  }

  const canSubmitCompetency = compForm.name.trim() && levelForms.some((l) => l.label.trim())

  const handleDeleteCompetency = (compId: string) => {
    if (!expandedFw) return
    setFwList(prev => prev.map(f => f.id === expandedFw.id
      ? { ...f, competencies: f.competencies.filter(c => c.id !== compId), updatedAt: todayISO() }
      : f
    ))
  }

  return (
    <div className="space-y-6">
      {notice && (
        <Card className="bg-mint/10 border-mint/30 p-3 rounded-pill flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
          <p className="text-sm text-mint">{notice}</p>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Framework Kompetensi</h1>
          <p className="text-text-secondary text-sm mt-1">Buat dan kelola framework kompetensi untuk assessment</p>
        </div>
        <Button onClick={() => setShowAddFw(true)} className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
          <Plus className="h-4 w-4 mr-2" /> Framework Baru
        </Button>
      </div>

      <div className="space-y-3">
        {fwList.length === 0 ? (
          <Card className="bg-surface border-image-frame p-12 rounded-pill text-center">
            <BookTemplate className="h-10 w-10 text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary">Belum ada framework</p>
            <Button onClick={() => setShowAddFw(true)} className="mt-4 bg-mint text-canvas rounded-pill">
              <Plus className="h-4 w-4 mr-1" /> Buat Framework Pertama
            </Button>
          </Card>
        ) : (
          fwList.map((fw) => {
            const isExpanded = expandedId === fw.id
            return (
              <Card
                key={fw.id}
                className={`bg-surface border-image-frame rounded-pill overflow-hidden transition-all ${isExpanded ? "ring-1 ring-mint/30" : ""}`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleFramework(fw.id)}
                  onKeyDown={(e) => e.key === "Enter" && toggleFramework(fw.id)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-ultraviolet/20 flex items-center justify-center shrink-0">
                    <BookTemplate className="h-5 w-5 text-ultraviolet" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-white truncate">{fw.name}</h3>
                      {fw.isTemplate && (
                        <Badge variant="outline" className="border-mint/30 text-mint text-[10px]">
                          Template
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {fw.competencies.length} kompetensi • Update: {fw.updatedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewFw(fw)}
                      title="Preview"
                      className="h-8 w-8 p-0 text-text-secondary hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => openClone(fw)}
                      title="Clone"
                      className="h-8 w-8 p-0 text-text-secondary hover:text-mint"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditFramework(fw)}
                      title="Edit"
                      className="h-8 w-8 p-0 text-text-secondary hover:text-mint"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteFramework(fw)}
                      title="Hapus"
                      className="h-8 w-8 p-0 text-text-secondary hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-mint shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-text-secondary shrink-0" />
                  )}
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-image-frame space-y-3">
                    <p className="text-[10px] text-text-secondary pt-3">
                      Dibuat: {fw.createdAt} • {fw.competencies.reduce((s, c) => s + c.levels.length, 0)} total level
                    </p>
                    <div className="grid gap-3">
                      {fw.competencies.map((comp) => (
                        <CompetencyCard key={comp.id} competency={comp} onDelete={() => handleDeleteCompetency(comp.id)} />
                      ))}
                      {fw.competencies.length === 0 && (
                        <Card className="bg-canvas border-image-frame p-6 rounded-pill text-center">
                          <p className="text-sm text-text-secondary">Belum ada kompetensi</p>
                        </Card>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowAddComp(true)}
                      variant="outline"
                      className="w-full border-dashed border-image-frame text-text-secondary hover:text-white rounded-pill"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Tambah Kompetensi
                    </Button>
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>

      <Dialog open={showAddFw} onOpenChange={setShowAddFw}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Framework Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Nama Framework *</label>
              <Input value={fwForm.name} onChange={e => setFwForm({ ...fwForm, name: e.target.value })}
                placeholder="Framework Assessment..." className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Deskripsi</label>
              <Textarea value={fwForm.description} onChange={e => setFwForm({ ...fwForm, description: e.target.value })}
                placeholder="Deskripsi framework..." className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 min-h-[80px]" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowAddFw(false)} variant="outline" className="flex-1 border-image-frame text-white hover:bg-surface-hover rounded-pill">
                Batal
              </Button>
              <Button onClick={handleAddFramework} disabled={!fwForm.name}
                className="flex-1 bg-mint text-canvas hover:bg-mint/90 rounded-pill disabled:opacity-50">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Buat Framework
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingFwId} onOpenChange={(open) => { if (!open) { setEditingFwId(null); setFwForm({ name: "", description: "" }) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-mint" />
              Edit Framework
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Nama Framework *</label>
              <Input
                value={fwForm.name}
                onChange={(e) => setFwForm({ ...fwForm, name: e.target.value })}
                placeholder="Nama framework..."
                className="bg-canvas border-image-frame text-white rounded-pill"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setEditingFwId(null); setFwForm({ name: "", description: "" }) }}
                className="flex-1 border-image-frame text-white rounded-pill hover:bg-surface-hover"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleSaveEditFramework}
                disabled={!fwForm.name.trim()}
                className="flex-1 bg-mint text-canvas rounded-pill hover:bg-mint/90 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewFw} onOpenChange={(open) => !open && setPreviewFw(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-mint" />
              Preview Framework
            </DialogTitle>
            {previewFw && (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-sm text-white font-medium">{previewFw.name}</p>
                {previewFw.isTemplate && (
                  <Badge variant="outline" className="border-mint/30 text-mint text-[10px]">
                    <BookTemplate className="h-3 w-3 mr-0.5" /> Template
                  </Badge>
                )}
              </div>
            )}
          </DialogHeader>

          {previewFw && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-canvas border-image-frame p-3 rounded-pill text-center">
                  <p className="text-lg font-bold text-mint">{previewFw.competencies.length}</p>
                  <p className="text-[10px] text-text-secondary">Kompetensi</p>
                </Card>
                <Card className="bg-canvas border-image-frame p-3 rounded-pill text-center">
                  <p className="text-lg font-bold text-white">
                    {previewFw.competencies.reduce((s, c) => s + c.levels.length, 0)}
                  </p>
                  <p className="text-[10px] text-text-secondary">Total Level</p>
                </Card>
                <Card className="bg-canvas border-image-frame p-3 rounded-pill text-center">
                  <p className="text-xs font-mono text-text-secondary">{previewFw.updatedAt}</p>
                  <p className="text-[10px] text-text-secondary">Terakhir Update</p>
                </Card>
              </div>

              {previewFw.competencies.length === 0 ? (
                <Card className="bg-canvas border-image-frame p-8 rounded-pill text-center">
                  <p className="text-text-secondary text-sm">Framework ini belum memiliki kompetensi</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {previewFw.competencies.map((comp) => (
                    <Card key={comp.id} className="bg-canvas border-image-frame p-4 rounded-pill">
                      <div className="flex items-start gap-2 mb-3">
                        <BrainCircuit className="h-4 w-4 text-mint mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold text-white">{comp.name}</h4>
                          <p className="text-xs text-text-secondary mt-0.5">{comp.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto border-image-frame text-text-secondary text-[10px] shrink-0">
                          {comp.levels.length} level
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {comp.levels.map((l) => (
                          <PreviewLevelRow key={l.level} level={l} />
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { openClone(previewFw); setPreviewFw(null) }}
                  className="flex-1 border-image-frame text-white rounded-pill hover:bg-surface-hover"
                >
                  <Copy className="h-4 w-4 mr-1" /> Clone Framework
                </Button>
                <Button
                  type="button"
                  onClick={() => setPreviewFw(null)}
                  className="flex-1 bg-mint text-canvas rounded-pill hover:bg-mint/90"
                >
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!cloneSource} onOpenChange={(open) => { if (!open) { setCloneSource(null); setCloneName("") } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-ultraviolet" />
              Clone Framework
            </DialogTitle>
            <p className="text-xs text-text-secondary mt-1">
              Duplikasi dari <strong className="text-white">{cloneSource?.name}</strong>
              {" "}({cloneSource?.competencies.length ?? 0} kompetensi)
            </p>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Nama Framework Baru *</label>
              <Input
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                placeholder="Nama framework hasil clone..."
                className="bg-canvas border-image-frame text-white rounded-pill"
              />
            </div>
            <p className="text-[10px] text-text-secondary">
              Semua kompetensi dan level akan disalin. Framework hasil clone bukan template dan dapat diedit bebas.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setCloneSource(null); setCloneName("") }}
                className="flex-1 border-image-frame text-white rounded-pill hover:bg-surface-hover"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleConfirmClone}
                disabled={!cloneName.trim()}
                className="flex-1 bg-ultraviolet text-white rounded-pill hover:bg-ultraviolet/90 disabled:opacity-50"
              >
                <Copy className="h-4 w-4 mr-1" /> Clone
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddComp} onOpenChange={(open) => { setShowAddComp(open); if (!open) resetCompForm() }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Kompetensi</DialogTitle>
            <p className="text-xs text-text-secondary mt-1">Ke framework: <strong className="text-white">{expandedFw?.name}</strong></p>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Nama Kompetensi *</label>
              <Input value={compForm.name} onChange={e => setCompForm({ ...compForm, name: e.target.value })}
                placeholder="Kepemimpinan" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Deskripsi</label>
              <Textarea value={compForm.description} onChange={e => setCompForm({ ...compForm, description: e.target.value })}
                placeholder="Kemampuan memimpin tim..." className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 min-h-[80px]" />
            </div>
            <div className="p-3 rounded-xl bg-canvas space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-text-secondary">Level yang akan dibuat</label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setLevelForms(createDefaultLevelForms())}
                    className="h-7 text-[10px] rounded-pill border-image-frame text-text-secondary hover:text-white px-2"
                  >
                    Reset Default
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addLevel}
                    disabled={levelForms.length >= MAX_LEVELS}
                    className="h-7 text-[10px] rounded-pill border-image-frame text-mint hover:bg-mint/10 px-2 disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3 mr-0.5" /> Level
                  </Button>
                </div>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {levelForms.map((lf, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-surface border border-image-frame space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`shrink-0 ${levelBadgeClass}`}>
                        Level {i + 1}
                      </Badge>
                      <Input
                        value={lf.label}
                        onChange={(e) => updateLevelForm(i, "label", e.target.value)}
                        placeholder={`Nama level ${i + 1}, mis. Pemula`}
                        className="bg-canvas border-image-frame text-white text-xs placeholder:text-text-secondary/50 rounded-pill h-8 flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeLevel(i)}
                        disabled={levelForms.length <= MIN_LEVELS}
                        className="text-text-secondary hover:text-red-400 p-1 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                        title="Hapus level"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Textarea
                      value={lf.indicator}
                      onChange={(e) => updateLevelForm(i, "indicator", e.target.value)}
                      placeholder={`Indikator perilaku level ${i + 1} (opsional)`}
                      className="bg-canvas border-image-frame text-white text-[11px] placeholder:text-text-secondary/50 min-h-[52px] resize-none"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-text-secondary">
                {levelForms.length} level • Isi nama setiap level. Indikator opsional; jika kosong akan digenerate otomatis.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => { setShowAddComp(false); resetCompForm() }} variant="outline" className="flex-1 border-image-frame text-white hover:bg-surface-hover rounded-pill">
                Batal
              </Button>
              <Button onClick={handleAddCompetency} disabled={!canSubmitCompetency}
                className="flex-1 bg-ultraviolet text-white hover:bg-ultraviolet/90 rounded-pill disabled:opacity-50">
                <Plus className="h-4 w-4 mr-1" /> Tambah
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
