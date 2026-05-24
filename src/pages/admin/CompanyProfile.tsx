import { useState } from "react"
import { users, type User } from "@/data/dummy"
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Building, Save, Plus, Shield, ShieldCheck, Mail, Phone, MapPin, Globe, FileText } from "lucide-react"

interface CompanyData {
  name: string
  industry: string
  taxId: string
  address: string
  phone: string
  email: string
  website: string
  description: string
}

const defaultCompany: CompanyData = {
  name: "PT Aikrut Teknologi Indonesia",
  industry: "Teknologi",
  taxId: "01.234.567.8-999.000",
  address: "Jl. Sudirman No. 123, Jakarta Pusat",
  phone: "021-12345678",
  email: "info@aikrut.com",
  website: "https://aikrut.com",
  description: "Perusahaan teknologi yang bergerak di bidang HR Assessment dan pengembangan talenta.",
}

const roleConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  Superadmin: { icon: <ShieldCheck className="h-3 w-3" />, color: "bg-red-400/10 text-red-400" },
  "HR/Admin": { icon: <Shield className="h-3 w-3" />, color: "bg-blue-400/10 text-blue-400" },
}

export default function CompanyProfile() {
  const [tab, setTab] = useState("company")
  const [company, setCompany] = useLocalStorage<CompanyData>("aikrut_company", defaultCompany)
  const [companyForm, setCompanyForm] = useState<CompanyData>(company)
  const [saved, setSaved] = useState(false)
  const [savedUsers, setSavedUsers] = useLocalStorage<User[]>("aikrut_users", users)

  const [showAdd, setShowAdd] = useState(false)
  const [accountForm, setAccountForm] = useState({ name: "", email: "", role: "HR/Admin" as "HR/Admin" | "Superadmin", department: "", password: "" })

  const hrUsers = savedUsers.filter(u => u.role === "HR/Admin" || u.role === "Superadmin")

  const handleSaveCompany = () => {
    setCompany(companyForm)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAddAccount = () => {
    if (!accountForm.name || !accountForm.email || !accountForm.password) return
    const newUser: User = {
      id: `USR-${String(savedUsers.length + 1).padStart(3, "0")}`,
      name: accountForm.name,
      email: accountForm.email,
      role: accountForm.role,
      department: accountForm.department,
      lastLogin: undefined,
    }
    setSavedUsers([newUser, ...savedUsers])
    setShowAdd(false)
    setAccountForm({ name: "", email: "", role: "HR/Admin", department: "", password: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Company Profile</h1>
          <p className="text-text-secondary text-sm mt-1">Kelola data perusahaan dan akun HR/Admin</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="bg-surface border border-image-frame rounded-pill p-1 inline-flex">
          <TabsTrigger value="company" className="rounded-pill data-[state=active]:bg-mint data-[state=active]:text-canvas text-text-secondary px-4 py-1.5 text-sm font-medium transition-all">
            <Building className="h-4 w-4 mr-2" /> Data Perusahaan
          </TabsTrigger>
          <TabsTrigger value="accounts" className="rounded-pill data-[state=active]:bg-mint data-[state=active]:text-canvas text-text-secondary px-4 py-1.5 text-sm font-medium transition-all">
            <Shield className="h-4 w-4 mr-2" /> Akun HR/Admin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6 mt-0">
          <Card className="bg-surface border-image-frame rounded-pill p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-mint/20 flex items-center justify-center">
                <Building className="h-6 w-6 text-mint" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Informasi Perusahaan</h2>
                <p className="text-xs text-text-secondary">Data identitas perusahaan Anda</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Nama Perusahaan *</label>
                <Input value={companyForm.name} onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                  placeholder="Nama perusahaan" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Industri</label>
                <Input value={companyForm.industry} onChange={e => setCompanyForm({ ...companyForm, industry: e.target.value })}
                  placeholder="Teknologi" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">NPWP / Tax ID</label>
                <Input value={companyForm.taxId} onChange={e => setCompanyForm({ ...companyForm, taxId: e.target.value })}
                  placeholder="01.234.567.8-999.000" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Email Perusahaan</label>
                <Input type="email" value={companyForm.email} onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                  placeholder="info@company.com" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">No. Telepon</label>
                <Input value={companyForm.phone} onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  placeholder="021-12345678" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Website</label>
                <Input value={companyForm.website} onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })}
                  placeholder="https://company.com" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-text-secondary mb-1 block">Alamat</label>
              <Textarea value={companyForm.address} onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                placeholder="Jl. Sudirman No. 123, Jakarta Pusat" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill min-h-[80px]" />
            </div>

            <div className="mt-4">
              <label className="text-xs text-text-secondary mb-1 block">Deskripsi Perusahaan</label>
              <Textarea value={companyForm.description} onChange={e => setCompanyForm({ ...companyForm, description: e.target.value })}
                placeholder="Deskripsi singkat tentang perusahaan" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill min-h-[80px]" />
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveCompany} className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
                {saved ? <>Tersimpan</> : <><Save className="h-4 w-4 mr-2" /> Simpan Perubahan</>}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6 mt-0">
          <Card className="bg-surface border-image-frame rounded-pill p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-ultraviolet/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-ultraviolet" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Akun HR/Admin</h2>
                  <p className="text-xs text-text-secondary">{hrUsers.length} akun terdaftar</p>
                </div>
              </div>
              <Button onClick={() => setShowAdd(true)} className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
                <Plus className="h-4 w-4 mr-2" /> Tambah Akun
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-image-frame hover:bg-transparent">
                    <TableHead className="text-text-secondary font-medium">Akun</TableHead>
                    <TableHead className="text-text-secondary font-medium">Role</TableHead>
                    <TableHead className="text-text-secondary font-medium">Departemen</TableHead>
                    <TableHead className="text-text-secondary font-medium">Terakhir Login</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hrUsers.map(u => {
                    const role = roleConfig[u.role]
                    return (
                      <TableRow key={u.id} className="border-image-frame hover:bg-surface-hover">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
                              u.role === "Superadmin" ? "bg-red-400/20 text-red-400" : "bg-blue-400/20 text-blue-400"
                            }`}>
                              {u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{u.name}</p>
                              <p className="text-xs text-text-secondary">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] border-0 ${role.color}`}>
                            {role.icon} {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-text-secondary">{u.department || "—"}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-text-secondary">{u.lastLogin || "Belum pernah"}</span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {hrUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-text-secondary py-8">
                        <Shield className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        Belum ada akun HR/Admin
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Akun Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Nama Lengkap *</label>
              <Input value={accountForm.name} onChange={e => setAccountForm({ ...accountForm, name: e.target.value })}
                placeholder="Nama pengguna" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Email *</label>
              <Input type="email" value={accountForm.email} onChange={e => setAccountForm({ ...accountForm, email: e.target.value })}
                placeholder="email@company.com" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Password *</label>
              <Input type="password" value={accountForm.password} onChange={e => setAccountForm({ ...accountForm, password: e.target.value })}
                placeholder="Min. 8 karakter" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Role</label>
                <Select value={accountForm.role} onValueChange={v => setAccountForm({ ...accountForm, role: v as "HR/Admin" | "Superadmin" })}>
                  <SelectTrigger className="bg-canvas border-image-frame text-white rounded-pill">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-image-frame text-white">
                    <SelectItem value="HR/Admin">HR/Admin</SelectItem>
                    <SelectItem value="Superadmin">Superadmin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Departemen</label>
                <Input value={accountForm.department} onChange={e => setAccountForm({ ...accountForm, department: e.target.value })}
                  placeholder="HRD" className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowAdd(false)} variant="outline" className="flex-1 border-image-frame text-white hover:bg-surface-hover rounded-pill">
                Batal
              </Button>
              <Button onClick={handleAddAccount} disabled={!accountForm.name || !accountForm.email || !accountForm.password}
                className="flex-1 bg-mint text-canvas hover:bg-mint/90 rounded-pill disabled:opacity-50">
                <Plus className="h-4 w-4 mr-1" /> Tambah Akun
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}