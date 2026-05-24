export type MasterStatus = "Active" | "Inactive"

export interface MasterDepartemen {
  id: string
  code: string
  name: string
  description: string
  status: MasterStatus
}

export interface MasterPosisi {
  id: string
  code: string
  name: string
  department: string
  description: string
  status: MasterStatus
}

export interface MasterLevelEmployee {
  id: string
  code: string
  name: string
  description: string
  status: MasterStatus
}

export const initialMasterDepartments: MasterDepartemen[] = [
  { id: "DEPT-001", code: "ENG", name: "Engineering", description: "Divisi engineering dan pengembangan produk", status: "Active" },
  { id: "DEPT-002", code: "MKT", name: "Marketing", description: "Divisi pemasaran dan brand", status: "Active" },
  { id: "DEPT-003", code: "FIN", name: "Finance", description: "Divisi keuangan dan akuntansi", status: "Active" },
  { id: "DEPT-004", code: "OPS", name: "Operations", description: "Divisi operasional", status: "Active" },
  { id: "DEPT-005", code: "HRD", name: "HRD", description: "Divisi sumber daya manusia", status: "Active" },
]

export const initialMasterPositions: MasterPosisi[] = [
  { id: "POS-001", code: "SE", name: "Senior Engineer", department: "Engineering", description: "Engineer senior individual contributor", status: "Active" },
  { id: "POS-002", code: "SWE", name: "Software Engineer", department: "Engineering", description: "Software engineer", status: "Active" },
  { id: "POS-003", code: "MA", name: "Marketing Associate", department: "Marketing", description: "Staf marketing", status: "Active" },
  { id: "POS-004", code: "FA", name: "Finance Analyst", department: "Finance", description: "Analis keuangan", status: "Active" },
  { id: "POS-005", code: "SO", name: "Supervisor Operations", department: "Operations", description: "Supervisor operasional", status: "Active" },
  { id: "POS-006", code: "EM", name: "Engineering Manager", department: "Engineering", description: "Manajer engineering", status: "Active" },
]

export const initialMasterLevels: MasterLevelEmployee[] = [
  { id: "LVL-001", code: "L2", name: "Junior", description: "Level junior / staff", status: "Active" },
  { id: "LVL-002", code: "L3", name: "Staff", description: "Level staff madya", status: "Active" },
  { id: "LVL-003", code: "L4", name: "Senior", description: "Level senior specialist", status: "Active" },
  { id: "LVL-004", code: "L5", name: "Manager", description: "Level manajerial", status: "Active" },
]
