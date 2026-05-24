import { useState } from "react"
import { frameworks, type Framework, type Competency, type LevelDescriptor } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Plus, FileText, Copy, Eye, GripVertical, ChevronDown, ChevronUp, CheckCircle2, BookTemplate, X
} from "lucide-react"

const levelLabels = ["Pemula", "Dasar", "Madya", "Lanjut", "Ahli"]

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
              <Badge className="mt-0.5 bg-ultraviolet/20 text-ultraviolet text-[10px] border-0 min-w-[4rem]">
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
  const [fwList, setFwList] = useState<Framework[]>(frameworks)
  const [activeId, setActiveId] = useState(fwList[0]?.id || "")
  const [showAddFw, setShowAddFw] = useState(false)
  const [showAddComp, setShowAddComp] = useState(false)
  const [fwForm, setFwForm] = useState({ name: "", description: "" })
  const [compForm, setCompForm] = useState({ name: "", description: "" })

  const active = fwList.find(f => f.id === activeId) ?? fwList[0]

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
    setActiveId(fw.id)
    setShowAddFw(false)
    setFwForm({ name: "", description: "" })
  }

  const handleAddCompetency = () => {
    if (!compForm.name || !active) return
    const comp: Competency = {
      id: `COMP-${String(Date.now()).slice(-4)}`,
      name: compForm.name,
      description: compForm.description,
      levels: levelLabels.map((label, i) => ({
        level: i + 1,
        label,
        indicator: `Deskripsi level ${i + 1} untuk ${compForm.name}`,
      })),
    }
    setFwList(prev => prev.map(f => f.id === active.id
      ? { ...f, competencies: [...f.competencies, comp], updatedAt: new Date().toISOString().split("T")[0] }
      : f
    ))
    setShowAddComp(false)
    setCompForm({ name: "", description: "" })
  }

  const handleDeleteCompetency = (compId: string) => {
    if (!active) return
    setFwList(prev => prev.map(f => f.id === active.id
      ? { ...f, competencies: f.competencies.filter(c => c.id !== compId), updatedAt: new Date().toISOString().split("T")[0] }
      : f
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Framework Kompetensi</h1>
          <p className="text-text-secondary text-sm mt-1">Buat dan kelola framework kompetensi untuk assessment</p>
        </div>
        <Button onClick={() => setShowAddFw(true)} className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
          <Plus className="h-4 w-4 mr-2" /> Framework Baru
        </Button>
      </div>

      <Tabs value={activeId} onValueChange={setActiveId}>
        <TabsList className="bg-surface border-image-frame rounded-pill flex-wrap h-auto">
          {fwList.map((f) => (
            <TabsTrigger key={f.id} value={f.id} className="data-[state=active]:bg-mint data-[state=active]:text-canvas rounded-pill">
              {f.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {fwList.map((fw) => (
          <TabsContent key={fw.id} value={fw.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{fw.name}</h2>
                  {fw.isTemplate && (
                    <Badge variant="outline" className="border-mint/30 text-mint text-[10px]">
                      <BookTemplate className="h-3 w-3 mr-0.5" /> Template
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  {fw.competencies.length} kompetensi • Dibuat: {fw.createdAt} • Diupdate: {fw.updatedAt}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-image-frame text-white hover:bg-surface-hover rounded-pill">
                  <Copy className="h-3 w-3 mr-1" /> Clone
                </Button>
                <Button variant="outline" size="sm" className="border-image-frame text-white hover:bg-surface-hover rounded-pill">
                  <Eye className="h-3 w-3 mr-1" /> Preview
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {fw.competencies.map((comp) => (
                <CompetencyCard key={comp.id} competency={comp} onDelete={() => handleDeleteCompetency(comp.id)} />
              ))}
              {fw.competencies.length === 0 && (
                <Card className="bg-canvas border-image-frame p-8 rounded-pill text-center">
                  <BookTemplate className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                  <p className="text-text-secondary">Belum ada kompetensi</p>
                  <p className="text-xs text-text-secondary mt-1">Klik tombol di bawah untuk menambah kompetensi pertama</p>
                </Card>
              )}
            </div>

            <Button onClick={() => setShowAddComp(true)} variant="outline" className="w-full border-dashed border-image-frame text-text-secondary hover:text-white hover:border-text-secondary rounded-pill">
              <Plus className="h-4 w-4 mr-2" /> Tambah Kompetensi
            </Button>
          </TabsContent>
        ))}
      </Tabs>

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

      <Dialog open={showAddComp} onOpenChange={setShowAddComp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kompetensi</DialogTitle>
            <p className="text-xs text-text-secondary mt-1">Ke framework: <strong className="text-white">{active?.name}</strong></p>
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
            <div className="p-3 rounded-xl bg-canvas">
              <p className="text-xs text-text-secondary mb-1">Level yang akan dibuat:</p>
              <div className="flex flex-wrap gap-1">
                {levelLabels.map((l, i) => (
                  <Badge key={i} variant="outline" className="border-image-frame text-text-secondary text-[10px]">
                    Level {i + 1}: {l}
                  </Badge>
                ))}
              </div>
              <p className="text-[10px] text-text-secondary mt-1">5 level deskriptif akan dibuat otomatis</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowAddComp(false)} variant="outline" className="flex-1 border-image-frame text-white hover:bg-surface-hover rounded-pill">
                Batal
              </Button>
              <Button onClick={handleAddCompetency} disabled={!compForm.name}
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
