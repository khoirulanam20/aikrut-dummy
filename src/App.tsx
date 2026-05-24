import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PortalProvider } from "@/context/PortalContext"
import { AppLayout } from "@/components/layout/AppLayout"
import PortalLayout from "@/components/layout/PortalLayout"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import BatchAssessment from "@/pages/BatchAssessment"
import BatchDetail from "@/pages/BatchDetail"
import CandidateComparison from "@/pages/CandidateComparison"
import CandidateDetail from "@/pages/CandidateDetail"
import FinalDecision from "@/pages/FinalDecision"
import Employee from "@/pages/Employee"
import FrameworkEditor from "@/pages/FrameworkEditor"
import PortalLogin from "@/pages/portal/PortalLogin"
import PortalDashboard from "@/pages/portal/PortalDashboard"
import EvidenceUpload from "@/pages/portal/EvidenceUpload"
import RoleplaySession from "@/pages/portal/RoleplaySession"
import PortalCompletion from "@/pages/portal/PortalCompletion"
import UserManagement from "@/pages/admin/UserManagement"
import AuditLog from "@/pages/admin/AuditLog"
import MasterDepartemen from "@/pages/master/MasterDepartemen"
import MasterPosisi from "@/pages/master/MasterPosisi"
import MasterLevelEmployee from "@/pages/master/MasterLevelEmployee"

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PortalProvider><Outlet /></PortalProvider>}>
            <Route path="/portal" element={<PortalLogin />} />
            <Route element={<PortalLayout />}>
              <Route path="/portal/dashboard" element={<PortalDashboard />} />
              <Route path="/portal/evidence" element={<EvidenceUpload />} />
              <Route path="/portal/roleplay" element={<RoleplaySession />} />
              <Route path="/portal/selesai" element={<PortalCompletion />} />
            </Route>
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/batch" element={<BatchAssessment />} />
            <Route path="/batch/:id" element={<BatchDetail />} />
            <Route path="/comparison" element={<CandidateComparison />} />
            <Route path="/candidate/:id" element={<CandidateDetail />} />
            <Route path="/candidate/:id/decision" element={<FinalDecision />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/framework" element={<FrameworkEditor />} />
            <Route path="/master/departemen" element={<MasterDepartemen />} />
            <Route path="/master/posisi" element={<MasterPosisi />} />
            <Route path="/master/level" element={<MasterLevelEmployee />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/audit" element={<AuditLog />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  )
}
