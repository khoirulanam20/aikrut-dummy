import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { usePortal } from "@/context/PortalContext"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload, FileText, CheckCircle2, Clock, AlertCircle,
  Trash2, BrainCircuit, ArrowRight,
} from "lucide-react"

interface DummyFile {
  id: string
  name: string
  type: string
  size: string
  status: "uploaded" | "processing" | "completed" | "error"
}

const acceptedFormats = [
  { ext: "PDF", desc: "Dokumen" },
  { ext: "DOCX", desc: "Word" },
  { ext: "JPG", desc: "Gambar" },
  { ext: "PNG", desc: "Gambar" },
]

export default function EvidenceUpload() {
  const navigate = useNavigate()
  const { user, setEvidenceCompleted } = usePortal()
  const defaultFiles: DummyFile[] = [
    { id: "F-1", name: "CV_Rudi_Hartono.pdf", type: "PDF", size: "2.4 MB", status: "completed" },
    { id: "F-2", name: "Sertifikat_AWS_Solutions_Architect.pdf", type: "PDF", size: "1.1 MB", status: "completed" },
    { id: "F-3", name: "Portfolio_Project_Migration.pdf", type: "PDF", size: "5.2 MB", status: "completed" },
  ]
  const [files, setFiles] = useLocalStorage<DummyFile[]>("aikrut_evidence_files", defaultFiles)
  const [dragging, setDragging] = useState(false)
  const [simulating, setSimulating] = useState(false)

  useEffect(() => {
    if (files.length > 0 && files.every((f) => f.status === "completed")) {
      setEvidenceCompleted()
    }
  }, [files, setEvidenceCompleted])

  const addFile = () => {
    const newFile: DummyFile = {
      id: `F-${Date.now()}`,
      name: `Dokumen_Pendukung_${files.length + 1}.pdf`,
      type: "PDF",
      size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB`,
      status: "uploaded",
    }
    setFiles((prev) => [...prev, newFile])
    setSimulating(true)
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => (f.id === newFile.id ? { ...f, status: "processing" as const } : f))
      )
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, status: "completed" as const } : f))
        )
        setSimulating(false)
      }, 2000)
    }, 800)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const statusIcon: Record<string, React.ReactNode> = {
    uploaded: <Clock className="h-4 w-4 text-yellow-400" />,
    processing: <BrainCircuit className="h-4 w-4 text-ultraviolet animate-pulse" />,
    completed: <CheckCircle2 className="h-4 w-4 text-mint" />,
    error: <AlertCircle className="h-4 w-4 text-red-400" />,
  }

  const completedCount = files.filter((f) => f.status === "completed").length
  const uploadProgress = files.length > 0 ? Math.round((completedCount / files.length) * 100) : 0
  const allDone = files.length > 0 && files.every((f) => f.status === "completed")

  if (!user) return null

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Upload Evidence</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Unggah dokumen pendukung untuk assessment Anda
        </p>
      </div>

      <Card className="bg-surface border-image-frame p-6 rounded-pill">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFile() }}
          className={`border-2 border-dashed rounded-pill p-8 text-center transition-all ${
            dragging ? "border-mint bg-mint/5" : "border-image-frame"
          }`}
        >
          <Upload className={`h-10 w-10 mx-auto mb-3 ${dragging ? "text-mint" : "text-text-secondary"}`} />
          <p className="text-sm text-white font-medium mb-1">
            {dragging ? "Lepaskan file di sini" : "Seret & lepas file di sini"}
          </p>
          <p className="text-xs text-text-secondary mb-4">atau klik tombol di bawah untuk memilih file</p>
          <Button
            onClick={addFile}
            disabled={simulating || files.length >= 5}
            variant="outline"
            className="border-image-frame text-white hover:bg-surface-hover rounded-pill disabled:opacity-50"
          >
            <Upload className="h-4 w-4 mr-2" /> Pilih File
          </Button>
          <div className="flex items-center justify-center gap-3 mt-4">
            {acceptedFormats.map((fmt) => (
              <Badge key={fmt.ext} variant="outline" className="border-image-frame text-text-secondary text-[10px]">
                {fmt.ext}
              </Badge>
            ))}
            <span className="text-[10px] text-text-secondary">Max 10MB</span>
          </div>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="bg-surface border-image-frame p-5 rounded-pill space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">File Terunggah</h2>
              <Badge className="bg-mint/10 text-mint text-[10px] border-0">
                {completedCount}/{files.length}
              </Badge>
            </div>
            {files.length < 5 && !simulating && (
              <button onClick={addFile} className="text-xs text-ultraviolet hover:text-ultraviolet/80 transition-colors">
                + Tambah file
              </button>
            )}
          </div>

          <Progress value={uploadProgress} className="h-1.5 bg-canvas" />

          <div className="space-y-2">
            {files.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-canvas group">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-ultraviolet flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{f.name}</p>
                    <p className="text-xs text-text-secondary">{f.type} • {f.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {statusIcon[f.status]}
                  <Badge className={`text-[10px] border-0 ${
                    f.status === "completed" ? "bg-mint/10 text-mint" :
                    f.status === "processing" ? "bg-ultraviolet/10 text-ultraviolet" :
                    f.status === "error" ? "bg-red-400/10 text-red-400" :
                    "bg-yellow-400/10 text-yellow-400"
                  }`}>
                    {f.status === "completed" ? "Selesai" :
                     f.status === "processing" ? "Memproses" :
                     f.status === "error" ? "Gagal" : "Antrian"}
                  </Badge>
                  {f.status !== "processing" && (
                    <button onClick={() => removeFile(f.id)} className="text-text-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {allDone && (
        <Card className="bg-mint/10 border-mint/30 p-5 rounded-pill">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-mint/20 mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-mint" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-mint mb-1">Evidence Berhasil Diproses!</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Semua {files.length} file telah diproses oleh Evidence Screener Engine. 
                Skor awal Anda telah dihasilkan. Silakan lanjutkan ke tahap berikutnya: 
                Sesi Roleplay dengan AI persona.
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/portal/roleplay")}
            className="mt-4 w-full bg-mint text-canvas hover:bg-mint/90 rounded-pill"
          >
            Lanjut ke Roleplay <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>
      )}
    </div>
  )
}
