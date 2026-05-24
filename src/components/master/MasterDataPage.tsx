import { useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react"
import type { MasterStatus } from "@/data/master"

type BaseRecord = {
  id: string
  code: string
  name: string
  description: string
  status: MasterStatus
}

type ExtraField = {
  key: string
  label: string
  placeholder?: string
  type?: "text" | "select"
  options?: string[]
}

interface MasterDataPageProps<T extends BaseRecord> {
  title: string
  subtitle: string
  storageKey: string
  initialData: T[]
  codePlaceholder?: string
  namePlaceholder?: string
  extraFields?: ExtraField[]
}

export default function MasterDataPage<T extends BaseRecord>({
  title,
  subtitle,
  storageKey,
  initialData,
  codePlaceholder = "KODE",
  namePlaceholder = "Nama",
  extraFields = [],
}: MasterDataPageProps<T>) {
  const [items, setItems] = useLocalStorage<T[]>(storageKey, initialData)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string>>({
    code: "",
    name: "",
    description: "",
    status: "Active",
    ...Object.fromEntries(extraFields.map((f) => [f.key, ""])),
  })

  const filtered = items.filter((item) => {
    const q = search.toLowerCase()
    const matchSearch =
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || item.status === statusFilter
    return matchSearch && matchStatus
  })

  const resetForm = () => {
    setForm({
      code: "",
      name: "",
      description: "",
      status: "Active",
      ...Object.fromEntries(extraFields.map((f) => [f.key, ""])),
    })
    setEditingId(null)
  }

  const openCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const openEdit = (item: T) => {
    const base: Record<string, string> = {
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    }
    extraFields.forEach((f) => {
      base[f.key] = String((item as Record<string, unknown>)[f.key] ?? "")
    })
    setForm(base)
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.code.trim() || !form.name.trim()) return

    const extra = Object.fromEntries(
      extraFields.map((f) => [f.key, form[f.key]?.trim() ?? ""])
    ) as Partial<T>

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...form, ...extra, code: form.code.trim(), name: form.name.trim(), description: form.description.trim(), status: form.status as MasterStatus }
            : item
        )
      )
    } else {
      const prefix = storageKey.includes("departemen") ? "DEPT" : storageKey.includes("posisi") ? "POS" : "LVL"
      const newItem = {
        id: `${prefix}-${String(Date.now()).slice(-6)}`,
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status as MasterStatus,
        ...extra,
      } as T
      setItems((prev) => [newItem, ...prev])
    }

    setShowForm(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
        </div>
        <Button onClick={openCreate} className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
          <Plus className="h-4 w-4 mr-2" /> Tambah Data
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            placeholder="Cari kode atau nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-surface border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-surface border-image-frame text-white rounded-pill">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-image-frame text-white">
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-surface border-image-frame rounded-pill overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-image-frame hover:bg-transparent">
              <TableHead className="text-text-secondary font-medium">Kode</TableHead>
              <TableHead className="text-text-secondary font-medium">Nama</TableHead>
              {extraFields.map((f) => (
                <TableHead key={f.key} className="text-text-secondary font-medium">{f.label}</TableHead>
              ))}
              <TableHead className="text-text-secondary font-medium">Deskripsi</TableHead>
              <TableHead className="text-text-secondary font-medium">Status</TableHead>
              <TableHead className="text-text-secondary font-medium text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="border-image-frame hover:bg-surface-hover">
                <TableCell className="font-mono text-sm text-mint">{item.code}</TableCell>
                <TableCell className="text-white font-medium">{item.name}</TableCell>
                {extraFields.map((f) => (
                  <TableCell key={f.key} className="text-text-secondary text-sm">
                    {String((item as Record<string, unknown>)[f.key] ?? "—")}
                  </TableCell>
                ))}
                <TableCell className="text-text-secondary text-sm max-w-[200px] truncate">{item.description || "—"}</TableCell>
                <TableCell>
                  <Badge className={`text-[10px] border-0 ${item.status === "Active" ? "bg-mint/10 text-mint" : "bg-yellow-400/10 text-yellow-400"}`}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button type="button" size="sm" variant="ghost" onClick={() => openEdit(item)} className="h-8 w-8 p-0 text-text-secondary hover:text-white">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0 text-text-secondary hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4 + extraFields.length} className="text-center text-text-secondary py-8">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <p className="text-xs text-text-secondary">{filtered.length} dari {items.length} data</p>

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) resetForm() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Data" : "Tambah Data"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Kode *</label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder={codePlaceholder}
                  className="bg-canvas border-image-frame text-white font-mono rounded-pill"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="bg-canvas border-image-frame text-white rounded-pill">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-image-frame text-white">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Nama *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={namePlaceholder}
                className="bg-canvas border-image-frame text-white rounded-pill"
              />
            </div>
            {extraFields.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-text-secondary mb-1 block">{f.label}</label>
                {f.type === "select" && f.options ? (
                  <Select value={form[f.key]} onValueChange={(v) => setForm({ ...form, [f.key]: v })}>
                    <SelectTrigger className="bg-canvas border-image-frame text-white rounded-pill">
                      <SelectValue placeholder={f.placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-image-frame text-white">
                      {f.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="bg-canvas border-image-frame text-white rounded-pill"
                  />
                )}
              </div>
            ))}
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Deskripsi</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Deskripsi..."
                className="bg-canvas border-image-frame text-white min-h-[72px]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm() }} className="flex-1 border-image-frame text-white rounded-pill">
                Batal
              </Button>
              <Button type="button" onClick={handleSave} disabled={!form.code.trim() || !form.name.trim()} className="flex-1 bg-mint text-canvas rounded-pill disabled:opacity-50">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
