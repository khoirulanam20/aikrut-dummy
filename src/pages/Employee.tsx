import { useState } from "react"
import { employees, type Employee } from "@/data/dummy"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Search, Plus, Building2, Users, Briefcase, Calendar, Phone, Mail, MapPin, ChevronDown, X, CheckCircle2 } from "lucide-react"

const departments = [...new Set(employees.map(e => e.department))]
const levels = [...new Set(employees.map(e => e.level))]
const categories = ["existing", "recruitment"] as const

export default function Employee() {
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: "", nik: "", email: "", department: "", position: "", level: "L3", phone: "", category: "existing" })
  const [added, setAdded] = useLocalStorage<Employee[]>("aikrut_employees", employees)

  const filtered = added.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.nik.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === "all" || e.department === deptFilter
    const matchLevel = levelFilter === "all" || e.level === levelFilter
    const matchStatus = statusFilter === "all" || e.status === statusFilter
    const matchCategory = categoryFilter === "all" || e.category === categoryFilter
    return matchSearch && matchDept && matchLevel && matchStatus && matchCategory
  })

  const handleAdd = () => {
    if (!form.name || !form.email) return
    const emp: Employee = {
      id: `EMP-${String(added.length + 1).padStart(3, "0")}`,
      nik: form.nik || `NIK-${new Date().getFullYear()}-${String(added.length + 1).padStart(3, "0")}`,
      name: form.name,
      email: form.email,
      department: form.department,
      position: form.position,
      level: form.level,
      joinDate: new Date().toISOString().split("T")[0],
      status: "Active",
      category: form.category as "existing" | "recruitment",
      phone: form.phone,
    }
    setAdded([emp, ...added])
    setShowAdd(false)
    setForm({ name: "", nik: "", email: "", department: "", position: "", level: "L3", phone: "", category: "existing" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Employee</h1>
          <p className="text-text-secondary text-sm mt-1">{added.length} karyawan terdaftar</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
          <Plus className="h-4 w-4 mr-2" /> Tambah Employee
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input placeholder="Cari nama, NIK, atau email..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-surface border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-36 bg-surface border-image-frame text-white rounded-pill">
            <SelectValue placeholder="Dept" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-image-frame text-white">
            <SelectItem value="all">Semua Dept</SelectItem>
            {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-28 bg-surface border-image-frame text-white rounded-pill">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-image-frame text-white">
            <SelectItem value="all">Semua Level</SelectItem>
            {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-28 bg-surface border-image-frame text-white rounded-pill">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-image-frame text-white">
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40 bg-surface border-image-frame text-white rounded-pill">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-image-frame text-white">
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="existing">Existing Employee</SelectItem>
            <SelectItem value="recruitment">Kandidat Rekrutmen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-surface border-image-frame rounded-pill overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-image-frame hover:bg-transparent">
              <TableHead className="text-text-secondary font-medium">Employee</TableHead>
              <TableHead className="text-text-secondary font-medium hidden md:table-cell">NIK</TableHead>
              <TableHead className="text-text-secondary font-medium">Departemen</TableHead>
              <TableHead className="text-text-secondary font-medium hidden sm:table-cell">Level</TableHead>
              <TableHead className="text-text-secondary font-medium">Kategori</TableHead>
              <TableHead className="text-text-secondary font-medium">Status</TableHead>
              <TableHead className="text-text-secondary font-medium hidden lg:table-cell">Terakhir Assessment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(emp => (
              <TableRow key={emp.id} className="border-image-frame hover:bg-surface-hover">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-ultraviolet/20 flex items-center justify-center text-xs font-bold text-ultraviolet">
                      {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{emp.name}</p>
                      <p className="text-[10px] text-text-secondary">{emp.position}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-xs text-text-secondary font-mono">{emp.nik}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-white">{emp.department}</span>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="border-image-frame text-text-secondary text-[10px]">{emp.level}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-[10px] border-0 ${emp.category === "existing" ? "bg-blue-400/10 text-blue-400" : "bg-ultraviolet/10 text-ultraviolet"}`}>
                    {emp.category === "existing" ? "Existing" : "Rekrutmen"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-[10px] border-0 ${emp.status === "Active" ? "bg-mint/10 text-mint" : "bg-red-400/10 text-red-400"}`}>
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-xs text-text-secondary">{emp.lastAssessment || "—"}</span>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-text-secondary py-8">
                  <Users className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  Tidak ada employee ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Employee Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Nama Lengkap *</label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama karyawan" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">NIK</label>
                <Input value={form.nik} onChange={e => setForm({ ...form, nik: e.target.value })}
                  placeholder="Auto-generate" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Email *</label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="email@company.com" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Departemen</label>
                <Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  placeholder="Engineering" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Posisi</label>
                <Input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
                  placeholder="Software Engineer" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Level</label>
                <Select value={form.level} onValueChange={v => setForm({ ...form, level: v })}>
                  <SelectTrigger className="bg-canvas border-image-frame text-white rounded-pill">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-image-frame text-white">
                    {["L1", "L2", "L3", "L4", "L5"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">No. Telepon</label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="0812-xxxx-xxxx" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Kategori</label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger className="bg-canvas border-image-frame text-white rounded-pill">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-image-frame text-white">
                  <SelectItem value="existing">Existing Employee</SelectItem>
                  <SelectItem value="recruitment">Kandidat Rekrutmen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowAdd(false)} variant="outline" className="flex-1 border-image-frame text-white hover:bg-surface-hover rounded-pill">
                Batal
              </Button>
              <Button onClick={handleAdd} disabled={!form.name || !form.email}
                className="flex-1 bg-mint text-canvas hover:bg-mint/90 rounded-pill disabled:opacity-50">
                <Plus className="h-4 w-4 mr-1" /> Tambah
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
