import { useState } from "react"
import { auditLogs } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Download, Shield, LogIn, FileText, UserPlus, CheckCircle2, AlertTriangle } from "lucide-react"

const actionConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  LOGIN: { icon: <LogIn className="h-3 w-3" />, color: "bg-blue-400/10 text-blue-400" },
  CREATE: { icon: <FileText className="h-3 w-3" />, color: "bg-mint/10 text-mint" },
  UPDATE: { icon: <FileText className="h-3 w-3" />, color: "bg-yellow-400/10 text-yellow-400" },
  ASSIGN: { icon: <UserPlus className="h-3 w-3" />, color: "bg-purple-400/10 text-purple-400" },
  FINALIZE: { icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-green-400/10 text-green-400" },
  DECISION: { icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-mint/10 text-mint" },
  UPLOAD: { icon: <FileText className="h-3 w-3" />, color: "bg-blue-400/10 text-blue-400" },
}

export default function AuditLog() {
  const [search, setSearch] = useState("")

  const filtered = auditLogs.filter((e) =>
    e.userName.toLowerCase().includes(search.toLowerCase()) ||
    e.action.toLowerCase().includes(search.toLowerCase()) ||
    e.entity.toLowerCase().includes(search.toLowerCase()) ||
    e.details.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <p className="text-text-secondary text-sm mt-1">Trail audit untuk compliance dan keamanan</p>
        </div>
        <Button variant="outline" className="border-image-frame text-white hover:bg-surface-hover rounded-pill">
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        <Input
          placeholder="Cari di audit log..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-surface border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill"
        />
      </div>

      <Card className="bg-surface border-image-frame rounded-pill overflow-hidden">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-image-frame hover:bg-transparent">
              <TableHead className="text-text-secondary font-medium">Waktu</TableHead>
              <TableHead className="text-text-secondary font-medium">Pengguna</TableHead>
              <TableHead className="text-text-secondary font-medium">Aksi</TableHead>
              <TableHead className="text-text-secondary font-medium">Entity</TableHead>
              <TableHead className="text-text-secondary font-medium text-right hidden md:table-cell">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((entry) => {
              const action = actionConfig[entry.action] || { icon: <Shield className="h-3 w-3" />, color: "bg-text-secondary/10 text-text-secondary" }
              return (
                <TableRow key={entry.id} className="border-image-frame hover:bg-surface-hover">
                  <TableCell className="text-xs text-text-secondary whitespace-nowrap">{entry.timestamp}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-white">{entry.userName}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] border-0 ${action.color}`}>
                      {action.icon} {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs text-white">{entry.entity} • {entry.entityId}</p>
                      <p className="text-[10px] text-text-secondary mt-0.5 max-w-xs truncate">{entry.details}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-text-secondary text-right hidden md:table-cell">{entry.ipAddress}</TableCell>
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
