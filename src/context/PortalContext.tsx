import { createContext, useContext, useState, type ReactNode } from "react"

interface PortalUser {
  id: string
  name: string
  email: string
  department: string
  position: string
  assessmentName: string
  batchId: string
  deadline: string
}

interface PortalProgress {
  evidenceUploaded: boolean
  evidenceCompleted: boolean
  roleplayCompleted: boolean
}

interface PortalContextType {
  user: PortalUser | null
  progress: PortalProgress
  login: (token: string) => boolean
  logout: () => void
  setEvidenceCompleted: () => void
  setRoleplayCompleted: () => void
}

const PortalContext = createContext<PortalContextType | null>(null)

export function PortalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null)
  const [progress, setProgress] = useState<PortalProgress>({
    evidenceUploaded: false,
    evidenceCompleted: false,
    roleplayCompleted: false,
  })

  const login = (token: string): boolean => {
    if (token.length < 3) return false
    setUser({
      id: "CAND-001",
      name: "Rudi Hartono",
      email: "rudi.hartono@company.com",
      department: "Engineering",
      position: "Senior Engineer",
      assessmentName: "Assessment Manager Engineering",
      batchId: "BATCH-001",
      deadline: "15 Juni 2026",
    })
    setProgress({
      evidenceUploaded: true,
      evidenceCompleted: true,
      roleplayCompleted: false,
    })
    return true
  }

  const logout = () => setUser(null)

  const setEvidenceCompleted = () => {
    setProgress((prev) => ({ ...prev, evidenceUploaded: true, evidenceCompleted: true }))
  }

  const setRoleplayCompleted = () => {
    setProgress((prev) => ({ ...prev, roleplayCompleted: true }))
  }

  return (
    <PortalContext.Provider value={{ user, progress, login, logout, setEvidenceCompleted, setRoleplayCompleted }}>
      {children}
    </PortalContext.Provider>
  )
}

export function usePortal() {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error("usePortal must be used within PortalProvider")
  return ctx
}
