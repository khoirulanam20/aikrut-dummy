import { createContext, useContext, useState, type ReactNode } from "react"
import { candidates as dummyCandidates, batches as dummyBatches } from "@/data/dummy"

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
  login: (accessCode: string) => boolean
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

  const login = (accessCode: string): boolean => {
    // Cari kandidat berdasarkan kode akses
    const candidate = dummyCandidates.find(c => c.accessCode === accessCode.toUpperCase())
    
    if (!candidate) return false
    
    // Cari batch yang sesuai
    const batch = dummyBatches.find(b => b.id === candidate.batchId)
    
    setUser({
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      department: candidate.department,
      position: candidate.position,
      assessmentName: batch?.name || "Assessment",
      batchId: candidate.batchId,
      deadline: batch?.deadline || "-",
    })
    
    // Set progress berdasarkan status kandidat
    const hasEvidence = candidate.status !== "Menunggu"
    const hasRoleplay = candidate.status === "Roleplay" || candidate.status === "Processing" || candidate.status === "Completed"
    const isCompleted = candidate.status === "Completed"
    
    setProgress({
      evidenceUploaded: hasEvidence,
      evidenceCompleted: hasEvidence || isCompleted,
      roleplayCompleted: hasRoleplay,
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
