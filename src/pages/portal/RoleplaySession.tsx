import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { usePortal } from "@/context/PortalContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare, Send, Bot, User, StopCircle, BrainCircuit,
  CheckCircle2, Clock, ArrowRight, Info, Sparkles, BarChart3
} from "lucide-react"

interface Message {
  id: string
  sender: "ai" | "candidate"
  content: string
  timestamp: string
}

const scenario = {
  title: "Menangani Anggota Tim yang Burnout",
  context: "Anda adalah Manager Engineering yang baru dipromosikan. Tim Anda sedang menghadapi deadline ketat, dan salah satu anggota tim senior Anda mengancam akan resign karena burnout. Bagaimana Anda menghadapi situasi ini?",
  competencies: ["Kepemimpinan", "Problem Solving", "Komunikasi", "Empati"],
}

const aiResponses: Record<string, string> = {
  default: "Saya mengerti. Bisakah Anda jelaskan lebih detail bagaimana Anda akan menangani situasi ini?",
  deadline: "Saya sudah kelelahan dengan beban kerja yang tidak realistis. 3 project dengan deadline di minggu yang sama. Saya rasa saya perlu istirahat panjang.",
  team: "Tim sudah tidak kompak. Ada tension antar anggota karena beban kerja tidak merata. Saya rasa ini masalah sistemik, bukan hanya masalah saya.",
  plan: "Saya appreciate langkah konkretnya. Tapi bagaimana saya tahu ini bukan hanya janji kosong seperti sebelumnya?",
  support: "Terima kasih sudah mendengar. Saya merasa sedikit lebih lega. Tapi saya masih butuh jaminan bahwa ini bukan solusi sementara.",
  trust: "Baik, saya akan coba bertahan dulu. Tapi tolong pastikan workload saya direview dalam 2 minggu ke depan. Saya perlu melihat perubahan nyata.",
}

export default function RoleplaySession() {
  const navigate = useNavigate()
  const { user, setRoleplayCompleted, progress } = usePortal()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "ai",
      content: `Halo ${user?.name.split(" ")[0] || "Kandidat"}, saya adalah AI Persona untuk simulasi roleplay. Saya akan berperan sebagai anggota tim Anda yang mengalami burnout.\n\n"${scenario.context}"\n\nSilakan mulai percakapan. Bagaimana Anda akan merespons situasi ini?`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [showCompletion, setShowCompletion] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const getAiResponse = (text: string): string => {
    const lower = text.toLowerCase()
    if (lower.includes("deadline") || lower.includes("beban") || lower.includes("lelah") || lower.includes("kerja")) return aiResponses.deadline
    if (lower.includes("tim") || lower.includes("team") || lower.includes("konflik") || lower.includes("tension")) return aiResponses.team
    if (lower.includes("rencana") || lower.includes("tindakan") || lower.includes("solusi") || lower.includes("minggu") || lower.includes("review")) return aiResponses.plan
    if (lower.includes("terima kasih") || lower.includes("thanks") || lower.includes("paham") || lower.includes("mengerti") || lower.includes("percaya")) return aiResponses.support
    if (lower.includes("coba") || lower.includes("bertahan") || lower.includes("setuju") || lower.includes("baik")) return aiResponses.trust
    return aiResponses.default
  }

  const handleSend = () => {
    if (!input.trim() || !isActive) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "candidate",
      content: input,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = getAiResponse(input)
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content: response,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  const handleEnd = () => {
    setIsActive(false)
    setRoleplayCompleted()
    const endMsg: Message = {
      id: `end-${Date.now()}`,
      sender: "ai",
      content: "Sesi roleplay telah diakhiri. Terima kasih atas partisipasi Anda. Hasil roleplay akan diproses dan digabungkan dengan evidence Anda untuk menghasilkan profil kompetensi yang lengkap.",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, endMsg])
    setTimeout(() => setShowCompletion(true), 800)
  }

  if (showCompletion) {
    const scores = [
      { name: "Kepemimpinan", score: 3.8, desc: "Mampu mengambil inisiatif dan memberikan solusi konkret" },
      { name: "Problem Solving", score: 4.0, desc: "Pendekatan sistematis dalam menyelesaikan masalah" },
      { name: "Komunikasi", score: 3.5, desc: "Komunikasi empatik dan persuasif" },
      { name: "Empati", score: 4.2, desc: "Menunjukkan kepedulian dan pemahaman terhadap kondisi anggota tim" },
    ]

    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-white">Sesi Roleplay Selesai</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Hasil simulasi sedang diproses oleh AI Engine
          </p>
        </div>

        <Card className="bg-gradient-to-br from-mint/10 to-surface border-mint/30 p-6 rounded-pill">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-mint/20">
              <CheckCircle2 className="h-6 w-6 text-mint" />
            </div>
            <div>
              <h2 className="font-bold text-white">Roleplay Completed</h2>
              <p className="text-xs text-text-secondary">
                {messages.length - 1} pesan • {scenario.title}
              </p>
            </div>
          </div>

          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-mint" />
            Skor Sementara per Kompetensi
          </h3>

          <div className="space-y-3">
            {scores.map((s) => (
              <div key={s.name} className="bg-canvas/50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{s.name}</span>
                  <span className="text-sm font-bold text-mint">{s.score.toFixed(1)}</span>
                </div>
                <Progress value={s.score * 20} className="h-1.5 bg-canvas mb-1" />
                <p className="text-[10px] text-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-surface border-image-frame p-5 rounded-pill">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-ultraviolet/20 mt-0.5">
              <BarChart3 className="h-5 w-5 text-ultraviolet" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-1">Profil Kompetensi Final</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Setelah sesi roleplay selesai, skor dari Evidence Screener dan Roleplay Engine 
                akan digabungkan (blended) menjadi profil kompetensi final. 
                HR akan mereview profil Anda dan memberikan keputusan akhir.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-canvas">
            <Info className="h-4 w-4 text-mint" />
            <p className="text-xs text-text-secondary">
              Anda akan menerima notifikasi email setelah hasil final dirilis oleh tim HR.
            </p>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/portal/dashboard")}
            variant="outline"
            className="flex-1 border-image-frame text-white hover:bg-surface-hover rounded-pill"
          >
            Ke Dashboard
          </Button>
          <Button
            onClick={() => navigate("/portal/selesai")}
            className="flex-1 bg-mint text-canvas hover:bg-mint/90 rounded-pill"
          >
            Lihat Ringkasan <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Sesi Roleplay</h1>
          <p className="text-sm text-text-secondary mt-0.5">Simulasi situasional dengan AI persona</p>
        </div>
        {isActive && (
          <Button
            onClick={handleEnd}
            disabled={messages.length < 3}
            variant="outline"
            className="border-red-400/50 text-red-400 hover:bg-red-400/10 rounded-pill disabled:opacity-50 text-xs"
          >
            <StopCircle className="h-4 w-4 mr-1" /> Akhiri Sesi
          </Button>
        )}
      </div>

      <Card className="bg-surface border-image-frame p-4 rounded-pill">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-ultraviolet/20 mt-0.5">
            <BrainCircuit className="h-4 w-4 text-ultraviolet" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-white">{scenario.title}</h3>
              <Badge className="bg-mint/10 text-mint text-[10px] border-0">
                <Sparkles className="h-3 w-3 mr-0.5" /> AI Persona
              </Badge>
            </div>
            <p className="text-xs text-text-secondary italic leading-relaxed">
              "{scenario.context}"
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {scenario.competencies.map((c) => (
                <Badge key={c} variant="outline" className="border-image-frame text-text-secondary text-[10px]">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-surface border-image-frame rounded-pill flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px] min-h-[300px]">
          {messages.map((m, i) => (
            <div key={m.id} className={`flex gap-2 ${m.sender === "candidate" ? "flex-row-reverse" : ""} ${i === 0 ? "opacity-80" : ""}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                m.sender === "ai" ? "bg-ultraviolet/20" : "bg-mint/20"
              }`}>
                {m.sender === "ai" ? (
                  <Bot className="h-4 w-4 text-ultraviolet" />
                ) : (
                  <User className="h-4 w-4 text-mint" />
                )}
              </div>
              <div className={`max-w-[80%] p-3 rounded-pill ${
                m.sender === "ai" ? "bg-canvas" : "bg-ultraviolet/10"
              }`}>
                <p className="text-xs text-white whitespace-pre-wrap leading-relaxed">{m.content}</p>
                <p className="text-[10px] text-text-secondary mt-1 text-right">{m.timestamp}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-ultraviolet/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-ultraviolet" />
              </div>
              <div className="bg-canvas p-3 rounded-pill">
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-text-secondary rounded-full animate-bounce" />
                  <div className="h-2 w-2 bg-text-secondary rounded-full animate-bounce delay-100" />
                  <div className="h-2 w-2 bg-text-secondary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {isActive && (
          <div className="p-4 border-t border-image-frame">
            <div className="flex items-center gap-2 text-[10px] text-text-secondary mb-2">
              <Info className="h-3 w-3" />
              <span>Ketik respons Anda sebagai seorang Manager Engineering</span>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan Anda..."
                className="flex-1 bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 rounded-pill"
              />
              <Button type="submit" disabled={!input.trim()} className="bg-mint text-canvas hover:bg-mint/90 rounded-pill disabled:opacity-50">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </Card>
    </div>
  )
}
