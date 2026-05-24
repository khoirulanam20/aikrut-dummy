import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { BrainCircuit, Eye, EyeOff, LogIn } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-mint mb-4">
            <BrainCircuit className="h-8 w-8 text-canvas" />
          </div>
          <h1 className="text-3xl font-bold text-white">Aikrut</h1>
          <p className="text-text-secondary mt-1">HR Assessment OS</p>
        </div>

        <div className="rounded-pill bg-surface border border-image-frame p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="nama@aikrut.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50"
                required
              />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-canvas border-image-frame text-white placeholder:text-text-secondary/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-mint text-canvas hover:bg-mint/90 font-semibold rounded-pill">
              <LogIn className="h-4 w-4 mr-2" />
              Masuk
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <Separator className="flex-1 bg-image-frame" />
            <span className="text-xs text-text-secondary">atau</span>
            <Separator className="flex-1 bg-image-frame" />
          </div>

          <Button variant="outline" className="w-full border-image-frame text-white hover:bg-surface-hover rounded-pill">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Login dengan Google
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-text-secondary">
            Demo: gunakan akun apa saja untuk masuk
          </p>
        </div>
      </div>
    </div>
  )
}
