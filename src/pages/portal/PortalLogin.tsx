import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePortal } from "@/context/PortalContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, UserCheck, KeyRound, ArrowRight, Shield, Info, HelpCircle } from "lucide-react"

export default function PortalLogin() {
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = usePortal()

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      if (login(accessCode)) {
        navigate("/portal/dashboard")
      } else {
        setError(true)
        setIsLoading(false)
      }
    }, 500)
  }

  const exampleCodes = ["RK4821", "MY7392", "RM8156"]

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-pill bg-gradient-to-br from-ultraviolet to-mint mb-4 shadow-lg shadow-ultraviolet/20">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Portal Kandidat</h1>
          <p className="text-text-secondary mt-1 text-sm">Akses assessment Aikrut Anda</p>
        </div>

        <Card className="bg-surface border-image-frame p-6 rounded-pill space-y-5">
          <form onSubmit={handleAccess} className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary mb-1.5 flex items-center gap-1">
                <KeyRound className="h-3.5 w-3.5" />
                Kode Akses
              </label>
              <Input
                placeholder="Masukkan kode akses Anda"
                value={accessCode}
                onChange={(e) => { 
                  setAccessCode(e.target.value.toUpperCase()); 
                  setError(false);
                }}
                maxLength={6}
                className={`bg-canvas border-image-frame text-white placeholder:text-text-secondary/40 font-mono text-lg tracking-widest text-center ${error ? "border-red-400 ring-1 ring-red-400/50" : ""}`}
                required
              />
              {accessCode && (
                <p className="text-[10px] text-text-secondary mt-1 text-center">
                  {accessCode.length}/{6} karakter
                </p>
              )}
              {error && (
                <p className="text-xs text-red-400 mt-1.5 text-center">
                  Kode akses tidak valid. Silakan periksa kembali kode yang diberikan oleh HR.
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || accessCode.length < 4}
              className="w-full bg-ultraviolet text-white hover:bg-ultraviolet/90 rounded-pill h-11 disabled:opacity-50"
            >
              {isLoading ? (
                <>Memverifikasi kode...</>
              ) : (
                <>Masuk <ArrowRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          </form>

          <div className="border-t border-image-frame pt-4">
            <p className="text-xs text-text-secondary text-center mb-2">
              Contoh kode untuk demo:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {exampleCodes.map((code) => (
                <button
                  key={code}
                  onClick={() => { setAccessCode(code); setError(false) }}
                  className="text-xs font-mono bg-canvas px-3 py-1.5 rounded-pill text-text-secondary hover:text-white hover:bg-surface-hover transition-all border border-image-frame"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-image-frame pt-4">
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white mb-1">Belum punya kode akses?</p>
                <p className="text-[10px]">
                  Kode akses dikirim melalui email dari HR. Periksa inbox Anda atau hubungi tim HR jika belum menerima.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2 justify-center text-xs text-text-secondary">
            <Shield className="h-3 w-3" />
            <span>Aman & Terenkripsi — Data Anda dilindungi</span>
          </div>
          <div className="flex items-center gap-1 justify-center text-[10px] text-text-secondary">
            <BrainCircuit className="h-3 w-3" />
            <span>Powered by Aikrut HR Assessment OS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
