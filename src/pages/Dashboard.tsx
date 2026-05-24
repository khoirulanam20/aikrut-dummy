import { Link } from "react-router-dom"
import { stats, batches } from "@/data/dummy"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LayoutDashboard,
  Users,
  GitBranch,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
} from "lucide-react"

const statusBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  Active: "default",
  Draft: "secondary",
  Completed: "outline",
}

export default function Dashboard() {
  const recentBatches = [...batches].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">Overview assessment dan batch management</p>
        </div>
        <Link to="/batch" className="text-sm text-mint hover:underline flex items-center gap-1">
          Lihat Semua <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-surface border-image-frame p-4 rounded-pill">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-mint/10">
              <GitBranch className="h-5 w-5 text-mint" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalBatches}</p>
              <p className="text-xs text-text-secondary">Total Batch</p>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <Badge variant="default" className="bg-mint/20 text-mint text-[10px] border-0">
              {stats.activeBatches} Active
            </Badge>
          </div>
        </Card>

        <Card className="bg-surface border-image-frame p-4 rounded-pill">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ultraviolet/10">
              <Users className="h-5 w-5 text-ultraviolet" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalCandidates}</p>
              <p className="text-xs text-text-secondary">Total Kandidat</p>
            </div>
          </div>
          <Progress value={65} className="mt-2 h-1 bg-canvas" />
        </Card>

        <Card className="bg-surface border-image-frame p-4 rounded-pill">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-400/10">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.completedAssessments}</p>
              <p className="text-xs text-text-secondary">Selesai Dinilai</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {Math.round((stats.completedAssessments / stats.totalCandidates) * 100)}% completion rate
          </p>
        </Card>

        <Card className="bg-surface border-image-frame p-4 rounded-pill">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-400/10">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.pendingReview}</p>
              <p className="text-xs text-text-secondary">Pending Review</p>
            </div>
          </div>
          <p className="text-xs text-yellow-400 mt-1">Menunggu keputusan HR</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-surface border-image-frame p-5 rounded-pill">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-mint" />
            Batch Terbaru
          </h2>
          <div className="space-y-3">
            {recentBatches.map((batch) => (
              <Link key={batch.id} to={`/batch/${batch.id}`} className="flex items-center justify-between p-3 rounded-xl bg-canvas hover:bg-surface-hover transition-colors cursor-pointer">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{batch.name}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{batch.department} • {batch.candidateCount} kandidat</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusBadgeVariant[batch.status]} className="text-[10px]">
                    {batch.status}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-text-secondary" />
                </div>
              </Link>
            ))}
            {recentBatches.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-4">Belum ada batch</p>
            )}
          </div>
        </Card>

        <Card className="bg-surface border-image-frame p-5 rounded-pill">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-ultraviolet" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/batch/new" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-canvas hover:bg-surface-hover transition-colors">
              <div className="p-2 rounded-lg bg-mint/10">
                <GitBranch className="h-5 w-5 text-mint" />
              </div>
              <span className="text-xs text-white font-medium">Buat Batch Baru</span>
            </Link>
            <Link to="/framework" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-canvas hover:bg-surface-hover transition-colors">
              <div className="p-2 rounded-lg bg-ultraviolet/10">
                <BrainCircuit className="h-5 w-5 text-ultraviolet" />
              </div>
              <span className="text-xs text-white font-medium">Edit Framework</span>
            </Link>
            <Link to="/comparison" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-canvas hover:bg-surface-hover transition-colors">
              <div className="p-2 rounded-lg bg-green-400/10">
                <Users className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-xs text-white font-medium">Bandingkan Kandidat</span>
            </Link>
            <Link to="/admin/users" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-canvas hover:bg-surface-hover transition-colors">
              <div className="p-2 rounded-lg bg-yellow-400/10">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-xs text-white font-medium">Kelola Pengguna</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
