import { useState } from "react"
import { users, type User } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, Shield, ShieldCheck } from "lucide-react"

const roleConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  Superadmin: { icon: <ShieldCheck className="h-3 w-3" />, color: "bg-red-400/10 text-red-400" },
  "HR/Admin": { icon: <Shield className="h-3 w-3" />, color: "bg-blue-400/10 text-blue-400" },
}

export default function UserManagement() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const filtered = users.filter((u) => {
    if (u.role === "Kandidat") return false
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Pengguna</h1>
          <p className="text-text-secondary text-sm mt-1">Kelola pengguna dan role assignment</p>
        </div>
        <Button className="bg-mint text-canvas hover:bg-mint/90 rounded-pill">
          <Plus className="h-4 w-4 mr-2" /> Tambah Pengguna
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            placeholder="Cari pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-surface border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36 bg-surface border-image-frame text-white rounded-pill">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-surface border-image-frame text-white">
            <SelectItem value="all">Semua Role</SelectItem>
            <SelectItem value="Superadmin">Superadmin</SelectItem>
            <SelectItem value="HR/Admin">HR/Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-surface border-image-frame rounded-pill overflow-hidden">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-image-frame hover:bg-transparent">
              <TableHead className="text-text-secondary font-medium">Pengguna</TableHead>
              <TableHead className="text-text-secondary font-medium">Role</TableHead>
              <TableHead className="text-text-secondary font-medium">Departemen</TableHead>
              <TableHead className="text-text-secondary font-medium">Terakhir Login</TableHead>
              <TableHead className="text-text-secondary font-medium"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => {
              const role = roleConfig[u.role]
              return (
                <TableRow key={u.id} className="border-image-frame hover:bg-surface-hover">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        u.role === "Superadmin" ? "bg-red-400/20 text-red-400" :
                        u.role === "HR/Admin" ? "bg-blue-400/20 text-blue-400" :
                        "bg-text-secondary/20 text-text-secondary"
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
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        </div>
      </Card>
    </div>
  )
}
