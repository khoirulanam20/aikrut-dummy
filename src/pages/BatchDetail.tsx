import { useMemo, useState, type ReactNode } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import { batches as dummyBatches, candidates as dummyCandidates, evidenceFiles, employees, type Candidate } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft, Users, Calendar, Clock, FileText, BrainCircuit, ChevronRight, Pencil, Building2,
  Share2, Copy, Check, ExternalLink, KeyRound, Link2, Mail, Trash2, Loader2,
} from "lucide-react"

const statusStyles: Record<string, string> = {
  Menunggu: "bg-yellow-400/10 text-yellow-400",
  Uploading: "bg-blue-400/10 text-blue-400",
  Roleplay: "bg-purple-400/10 text-purple-400",
  Processing: "bg-orange-400/10 text-orange-400",
  Completed: "bg-mint/10 text-mint",
}

type PortalAccess = { name: string; email: string; token: string; code: string; link: string }

type ListRow = {
  rowId: string
  name: string
  email: string
  displayName: string
  categoryBadge: ReactNode
  subtitle: string
  cand?: Candidate
  detailHref?: string
  employeeId?: string
}

function getPortalAccess(name: string, email: string, cand?: Candidate, employeeId?: string): PortalAccess {
  const token = cand?.invitationToken ?? (employeeId ? `AIKRUT-${employeeId}-2026` : "AIKRUT-PENDING-2026")
  const code = cand?.accessCode ?? (employeeId ? employeeId.replace("EMP-", "") + "2026" : "------")
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const link = `${origin}/portal?token=${encodeURIComponent(token)}`
  return { name, email, token, code, link }
}

async function simulateSendEmail(recipients: { name: string; email: string }[], batchName: string) {
  await new Promise((r) => setTimeout(r, 800))
  return recipients.map((r) => r.email)
}

function CopyField({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Link2 }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <label className="text-xs text-text-secondary mb-1.5 flex items-center gap-1">
        <Icon className="h-3 w-3" /> {label}
      </label>
      <div className="flex gap-2">
        <Input
          readOnly
          value={value}
          className="bg-canvas border-image-frame text-white text-xs font-mono flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleCopy}
          className="rounded-pill border-image-frame text-white hover:bg-surface-hover shrink-0"
        >
          {copied ? <Check className="h-4 w-4 text-mint" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

function RowCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(e) => e.stopPropagation()}
      className="h-4 w-4 shrink-0 rounded border-image-frame bg-canvas accent-mint cursor-pointer"
    />
  )
}

function CandidateRow({
  row,
  checked,
  onCheckedChange,
  onShare,
}: {
  row: ListRow
  checked: boolean
  onCheckedChange: (v: boolean) => void
  onShare: () => void
}) {
  const cardInner = (
    <Card className={`bg-surface border-image-frame p-4 rounded-pill hover:bg-surface-hover transition-all flex-1 min-w-0 ${checked ? "ring-1 ring-mint/40" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-10 w-10 rounded-full bg-ultraviolet/20 flex items-center justify-center text-sm font-bold text-ultraviolet flex-shrink-0">
            {row.displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-white truncate">{row.displayName}</p>
              {row.categoryBadge}
            </div>
            <p className="text-xs text-text-secondary truncate">{row.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <Badge className={`text-[10px] border-0 ${statusStyles[row.cand?.status ?? "Menunggu"] || statusStyles.Menunggu}`}>
            {row.cand?.status ?? "Menunggu"}
          </Badge>
          {row.cand?.aiRecommendation && (
            <Badge className={`text-[10px] border-0 ${
              row.cand.aiRecommendation === "Promote" || row.cand.aiRecommendation === "Hire"
                ? "bg-mint/10 text-mint"
                : "bg-yellow-400/10 text-yellow-400"
            }`}>
              {row.cand.aiRecommendation}
            </Badge>
          )}
          {row.detailHref && <ChevronRight className="h-4 w-4 text-text-secondary" />}
        </div>
      </div>
      {row.cand?.competencyProfile && (
        <div className="mt-3 flex flex-wrap gap-2">
          {row.cand.competencyProfile.scores.map((s) => (
            <div key={s.competencyId} className="flex items-center gap-1 text-[10px] bg-canvas rounded px-2 py-1">
              <BrainCircuit className="h-3 w-3 text-mint" />
              <span className="text-text-secondary">{s.competencyName}: </span>
              <span className="text-white font-medium">{s.blendedScore.toFixed(1)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )

  return (
    <div className="flex items-stretch gap-2">
      <div className="flex items-center px-1 shrink-0 self-center">
        <RowCheckbox checked={checked} onChange={onCheckedChange} />
      </div>
      {row.detailHref ? (
        <Link to={row.detailHref} className="flex-1 min-w-0 block">{cardInner}</Link>
      ) : (
        <div className="flex-1 min-w-0">{cardInner}</div>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={onShare}
        title="Bagikan link portal"
        className="h-auto px-3 rounded-pill border-image-frame text-text-secondary hover:text-mint hover:border-mint/30 hover:bg-surface-hover shrink-0 self-center"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function BatchDetail() {
  const { id } = useParams()
  const location = useLocation()
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [shareAccess, setShareAccess] = useState<PortalAccess | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [removedRowIds, setRemovedRowIds] = useState<Set<string>>(new Set())
  const [notice, setNotice] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [shareEmailSending, setShareEmailSending] = useState(false)

  const batch = (location.state as any)?.batch || dummyBatches.find((b) => b.id === id)
  if (!batch) return <div className="text-text-secondary">Batch tidak ditemukan</div>

  const batchCandidates = dummyCandidates.filter((c) => c.batchId === batch.id)
  const completedCount = batchCandidates.filter((c) => c.status === "Completed").length

  const allAssigned = employees.filter(e => batch.assignedEmployeeIds?.includes(e.id))
  const assignedIds = new Set(batch.assignedEmployeeIds ?? [])

  const filteredAssigned = allAssigned.filter(
    e => categoryFilter === "all" || e.category === categoryFilter
  )

  const unlinkedCandidates = batchCandidates.filter(c => {
    const emp = employees.find(e => e.name === c.name)
    return !emp || !assignedIds.has(emp.id)
  })

  const orphanCandidates = unlinkedCandidates.filter(c => {
    if (categoryFilter === "all") return true
    const emp = employees.find(e => e.name === c.name)
    if (!emp || c.isExternal) return categoryFilter === "recruitment"
    return emp.category === categoryFilter
  })

  const listRows = useMemo(() => {
    const rows: ListRow[] = []

    filteredAssigned.forEach((emp) => {
      const cand = batchCandidates.find(c => c.name === emp.name)
      const files = cand ? evidenceFiles.filter(f => f.candidateId === cand.id) : []
      const subtitle = cand
        ? `${cand.position}${cand.isExternal ? " (Eksternal)" : ""} • ${files.length} file`
        : `${emp.position} • ${emp.department} • ${emp.level}`

      rows.push({
        rowId: emp.id,
        name: emp.name,
        email: cand?.email ?? emp.email,
        employeeId: emp.id,
        displayName: emp.name,
        categoryBadge: (
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono tracking-wider uppercase flex-shrink-0 ${emp.category === "existing" ? "bg-blue-400/10 text-blue-400" : "bg-ultraviolet/10 text-ultraviolet"}`}>
            {emp.category === "existing" ? "Existing" : "Rekrutmen"}
          </span>
        ),
        subtitle,
        cand,
        detailHref: cand ? `/candidate/${cand.id}` : undefined,
      })
    })

    orphanCandidates.forEach((c) => {
      const files = evidenceFiles.filter(f => f.candidateId === c.id)
      rows.push({
        rowId: `cand-${c.id}`,
        name: c.name,
        email: c.email,
        displayName: c.name,
        categoryBadge: (
          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono tracking-wider uppercase flex-shrink-0 bg-ultraviolet/10 text-ultraviolet">
            {c.isExternal ? "Eksternal" : "Rekrutmen"}
          </span>
        ),
        subtitle: `${c.position} ${c.isExternal ? "(Eksternal)" : ""} • ${files.length} file`,
        cand: c,
        detailHref: `/candidate/${c.id}`,
      })
    })

    return rows.filter(r => !removedRowIds.has(r.rowId))
  }, [filteredAssigned, orphanCandidates, batchCandidates, removedRowIds])

  const hasAnyCandidates = allAssigned.length > 0 || batchCandidates.length > 0
  const visibleCount = listRows.length
  const totalCount = allAssigned.length + unlinkedCandidates.length
  const displayCount = categoryFilter === "all"
    ? totalCount - removedRowIds.size
    : visibleCount
  const selectedCount = listRows.filter(r => selectedIds.has(r.rowId)).length
  const allVisibleSelected = visibleCount > 0 && selectedCount === visibleCount

  const showNotice = (message: string) => {
    setNotice(message)
    setTimeout(() => setNotice(null), 4000)
  }

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(listRows.map(r => r.rowId)))
    }
  }

  const toggleRow = (rowId: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (checked) next.add(rowId)
      else next.delete(rowId)
      return next
    })
  }

  const getSelectedRows = () => listRows.filter(r => selectedIds.has(r.rowId))

  const handleBulkDelete = () => {
    const ids = getSelectedRows().map(r => r.rowId)
    setRemovedRowIds(prev => new Set([...prev, ...ids]))
    setSelectedIds(new Set())
    setConfirmDelete(false)
    showNotice(`${ids.length} kandidat dihapus dari batch`)
  }

  const handleBulkSendEmail = async () => {
    const rows = getSelectedRows()
    if (rows.length === 0) return
    setEmailSending(true)
    try {
      await simulateSendEmail(rows.map(r => ({ name: r.name, email: r.email })), batch.name)
      setSelectedIds(new Set())
      showNotice(`Email undangan terkirim ke ${rows.length} kandidat`)
    } finally {
      setEmailSending(false)
    }
  }

  const handleShareSendEmail = async () => {
    if (!shareAccess) return
    setShareEmailSending(true)
    try {
      await simulateSendEmail([{ name: shareAccess.name, email: shareAccess.email }], batch.name)
      showNotice(`Email undangan terkirim ke ${shareAccess.email}`)
    } finally {
      setShareEmailSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {notice && (
        <Card className="bg-mint/10 border-mint/30 p-3 rounded-pill flex items-center gap-2">
          <Check className="h-4 w-4 text-mint shrink-0" />
          <p className="text-sm text-mint">{notice}</p>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Link to="/batch" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-mint transition-colors">
          <ArrowLeft className="h-3 w-3" /> Kembali
        </Link>
        <Link to="/batch" state={{ editBatchId: batch.id }}>
          <Button className="bg-surface border border-image-frame text-white hover:bg-surface-hover rounded-pill text-xs">
            <Pencil className="h-3 w-3 mr-1" /> Edit Batch
          </Button>
        </Link>
      </div>

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

      <Progress value={batch.candidateCount > 0 ? (completedCount / batch.candidateCount) * 100 : 0} className="h-2 bg-canvas" />

      {hasAnyCandidates ? (
        <div>
          <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              {visibleCount > 0 && (
                <RowCheckbox checked={allVisibleSelected} onChange={() => toggleSelectAll()} />
              )}
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-mint" /> Kandidat Batch
                <span className="text-xs text-text-secondary font-normal">
                  ({displayCount})
                </span>
              </h2>
            </div>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setSelectedIds(new Set()) }}>
              <SelectTrigger className="w-36 bg-surface border-image-frame text-white rounded-pill text-xs h-8">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-image-frame text-white">
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="existing">Existing Employee</SelectItem>
                <SelectItem value="recruitment">Kandidat Rekrutmen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedCount > 0 && (
            <Card className="bg-surface border-mint/30 p-3 rounded-pill mb-3 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-sm text-white">
                <span className="text-mint font-medium">{selectedCount}</span> kandidat dipilih
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  size="sm"
                  disabled={emailSending}
                  onClick={handleBulkSendEmail}
                  className="bg-ultraviolet text-white hover:bg-ultraviolet/90 rounded-pill text-xs h-8"
                >
                  {emailSending ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Mail className="h-3 w-3 mr-1" />}
                  Kirim Email
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setConfirmDelete(true)}
                  className="rounded-pill border-red-400/40 text-red-400 hover:bg-red-400/10 text-xs h-8"
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Hapus
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedIds(new Set())}
                  className="rounded-pill border-image-frame text-text-secondary hover:text-white text-xs h-8"
                >
                  Batal
                </Button>
              </div>
            </Card>
          )}

          {visibleCount === 0 ? (
            <Card className="bg-surface border-image-frame p-6 rounded-pill text-center">
              <p className="text-sm text-text-secondary">Tidak ada kandidat untuk kategori ini</p>
            </Card>
          ) : (
          <div className="grid gap-3">
            {listRows.map((row) => (
              <CandidateRow
                key={row.rowId}
                row={row}
                checked={selectedIds.has(row.rowId)}
                onCheckedChange={(v) => toggleRow(row.rowId, v)}
                onShare={() => setShareAccess(getPortalAccess(row.name, row.email, row.cand, row.employeeId))}
              />
            ))}
          </div>
          )}
        </div>
      ) : (
        <Card className="bg-surface border-image-frame p-8 rounded-pill text-center">
          <Users className="h-8 w-8 text-text-secondary mx-auto mb-2" />
          <p className="text-text-secondary">Belum ada kandidat di-assign ke batch ini</p>
        </Card>
      )}

      <Dialog open={!!shareAccess} onOpenChange={(open) => !open && setShareAccess(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-mint" />
              Bagikan Portal Kandidat
            </DialogTitle>
            <p className="text-sm text-text-secondary mt-1">
              {shareAccess?.name}
              {shareAccess?.email && (
                <span className="block text-xs mt-0.5">{shareAccess.email}</span>
              )}
            </p>
          </DialogHeader>

          {shareAccess && (
            <div className="space-y-4">
              <CopyField label="Link Portal" value={shareAccess.link} icon={Link2} />
              <CopyField label="Kode Akses" value={shareAccess.code} icon={KeyRound} />
              <div className="rounded-pill bg-canvas border border-image-frame p-3">
                <p className="text-[10px] text-text-secondary mb-1">Token (alternatif login)</p>
                <p className="text-xs font-mono text-white tracking-wider">{shareAccess.token}</p>
              </div>
              <p className="text-[10px] text-text-secondary">
                Kirim link dan kode akses ke kandidat via email. Kandidat dapat login di portal tanpa akun terdaftar.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  type="button"
                  disabled={shareEmailSending}
                  onClick={handleShareSendEmail}
                  className="w-full bg-mint text-canvas hover:bg-mint/90 rounded-pill"
                >
                  {shareEmailSending ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-1" />
                  )}
                  Kirim Email
                </Button>
                <div className="flex gap-2">
                  <a
                    href={shareAccess.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-ultraviolet text-white hover:bg-ultraviolet/90 rounded-pill">
                      <ExternalLink className="h-4 w-4 mr-1" /> Buka Portal
                    </Button>
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShareAccess(null)}
                    className="rounded-pill border-image-frame text-white hover:bg-surface-hover"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Trash2 className="h-5 w-5" />
              Hapus Kandidat
            </DialogTitle>
            <p className="text-sm text-text-secondary mt-2">
              Yakin ingin menghapus <span className="text-white font-medium">{selectedCount} kandidat</span> dari batch ini? Tindakan ini tidak dapat dibatalkan.
            </p>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDelete(false)}
              className="rounded-pill border-image-frame text-white hover:bg-surface-hover"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleBulkDelete}
              className="rounded-pill bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-400/40"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
