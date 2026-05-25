export type BatchStatus = "Draft" | "Active" | "Completed"

export type DecisionType = "Promote" | "Not Yet" | "No" | "Hire"

export interface Employee {
  id: string
  nik: string
  name: string
  email: string
  department: string
  position: string
  level: string
  joinDate: string
  status: "Active" | "Inactive"
  category: "existing" | "recruitment"
  phone?: string
  lastAssessment?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "Superadmin" | "HR/Admin" | "Kandidat"
  avatar?: string
  department?: string
  lastLogin?: string
  isExternal?: boolean
}

export interface Framework {
  id: string
  name: string
  isTemplate: boolean
  competencies: Competency[]
  createdAt: string
  updatedAt: string
}

export interface Competency {
  id: string
  name: string
  description: string
  levels: LevelDescriptor[]
}

export interface LevelDescriptor {
  level: number
  label: string
  indicator: string
}

export interface Batch {
  id: string
  name: string
  position: string
  department: string
  status: BatchStatus
  frameworkId: string
  frameworkName: string
  deadline: string
  candidateCount: number
  completedCount: number
  createdAt: string
  createdBy: string
  assignedEmployeeIds: string[]
}

export interface Candidate {
  id: string
  batchId: string
  name: string
  email: string
  position: string
  department: string
  isExternal: boolean
  status: "Menunggu" | "Uploading" | "Roleplay" | "Processing" | "Completed"
  competencyProfile?: CompetencyProfile
  aiSummary?: AiSummary
  aiRecommendation?: DecisionType
  hrDecision?: DecisionType
  hrNote?: string
  overrideReason?: string
  accessCode: string // Kode akses unik 4-6 karakter untuk login portal (required)
  invitationToken?: string // DEPRECATED: Tidak digunakan lagi, diganti dengan accessCode
}

export interface CompetencyScore {
  competencyId: string
  competencyName: string
  evidenceScore: number
  roleplayScore: number
  blendedScore: number
  confidence: number
  justification: string
  evidenceExcerpt?: string
  gap: number
}

export interface CompetencyProfile {
  scores: CompetencyScore[]
  blendedAt: string
  snapshot: boolean
}

export interface AiSummary {
  generatedAt: string
  overview: string
  strengths: string[]
  developmentAreas: string[]
  evidenceHighlights: string
  roleplayHighlights: string
  recommendationRationale: string
}

export interface EvidenceFile {
  id: string
  candidateId: string
  name: string
  type: string
  size: string
  status: "uploaded" | "processing" | "completed" | "error"
  uploadedAt: string
}

export interface RoleplayMessage {
  id: string
  sessionId: string
  sender: "ai" | "candidate"
  content: string
  timestamp: string
}

export interface RoleplaySession {
  id: string
  candidateId: string
  scenario: string
  competency: string
  status: "not_started" | "in_progress" | "completed"
  messages: RoleplayMessage[]
  startedAt?: string
  completedAt?: string
}

export interface AuditEntry {
  id: string
  userId: string
  userName: string
  action: string
  entity: string
  entityId: string
  details: string
  timestamp: string
  ipAddress: string
}

const now = new Date()

export const users: User[] = [
  { id: "USR-001", name: "Budi Santoso", email: "budi@aikrut.com", role: "Superadmin", department: "IT", lastLogin: "2026-05-20 08:30" },
  { id: "USR-002", name: "Sari Dewi", email: "sari@aikrut.com", role: "HR/Admin", department: "HRD", lastLogin: "2026-05-20 07:45" },
  { id: "USR-003", name: "Ahmad Rizki", email: "ahmad@aikrut.com", role: "HR/Admin", department: "HRD", lastLogin: "2026-05-19 16:20" },
  { id: "USR-004", name: "Dian Permata", email: "dian@aikrut.com", role: "HR/Admin", department: "Talent Management", lastLogin: "2026-05-18 09:15" },
  { id: "USR-005", name: "Rudi Hartono", email: "rudi.hartono@company.com", role: "Kandidat", department: "Engineering", lastLogin: undefined },
  { id: "USR-006", name: "Maya Indah", email: "maya.indah@company.com", role: "Kandidat", department: "Marketing", lastLogin: undefined },
  { id: "USR-007", name: "Agus Wijaya", email: "agus.wijaya@company.com", role: "Kandidat", department: "Finance", lastLogin: undefined },
  { id: "USR-008", name: "Fitri Handayani", email: "fitri.handayani@company.com", role: "Kandidat", department: "Engineering", lastLogin: undefined },
  { id: "USR-009", name: "Denny Saputra", email: "denny.saputra@company.com", role: "Kandidat", department: "Operations", lastLogin: undefined },
  { id: "USR-010", name: "Rina Mariana", email: "rina.mariana@company.com", role: "Kandidat", department: "Marketing", lastLogin: undefined },
  { id: "USR-011", name: "Hendra Gunawan", email: "hendra.ext@external.com", role: "Kandidat", department: "Engineering", isExternal: true, lastLogin: undefined },
  { id: "USR-012", name: "Sarah Putri", email: "sarah.ext@external.com", role: "Kandidat", isExternal: true, department: "Product", lastLogin: undefined },
]

export const employees: Employee[] = [
  { id: "EMP-001", nik: "NIK-2020-001", name: "Rudi Hartono", email: "rudi.hartono@company.com", department: "Engineering", position: "Senior Engineer", level: "L4", joinDate: "2020-03-15", status: "Active", category: "existing", phone: "0812-3456-7890", lastAssessment: "2026-05-15" },
  { id: "EMP-002", nik: "NIK-2019-002", name: "Maya Indah", email: "maya.indah@company.com", department: "Marketing", position: "Marketing Associate", level: "L3", joinDate: "2019-07-01", status: "Active", category: "existing", phone: "0813-3456-7891", lastAssessment: "2026-05-16" },
  { id: "EMP-003", nik: "NIK-2021-003", name: "Agus Wijaya", email: "agus.wijaya@company.com", department: "Finance", position: "Finance Analyst", level: "L3", joinDate: "2021-01-10", status: "Active", category: "existing", phone: "0814-3456-7892", lastAssessment: "2026-04-28" },
  { id: "EMP-004", nik: "NIK-2018-004", name: "Fitri Handayani", email: "fitri.handayani@company.com", department: "Engineering", position: "Senior Engineer", level: "L4", joinDate: "2018-11-20", status: "Active", category: "existing", phone: "0815-3456-7893" },
  { id: "EMP-005", nik: "NIK-2022-005", name: "Denny Saputra", email: "denny.saputra@company.com", department: "Operations", position: "Supervisor Operations", level: "L3", joinDate: "2022-06-01", status: "Active", category: "existing", phone: "0816-3456-7894", lastAssessment: "2026-05-08" },
  { id: "EMP-006", nik: "NIK-2020-006", name: "Rina Mariana", email: "rina.mariana@company.com", department: "Marketing", position: "Marketing Associate", level: "L3", joinDate: "2020-09-15", status: "Active", category: "existing", phone: "0817-3456-7895", lastAssessment: "2026-05-17" },
  { id: "EMP-007", nik: "NIK-2017-007", name: "Bambang Suprapto", email: "bambang@company.com", department: "Engineering", position: "Engineering Manager", level: "L5", joinDate: "2017-04-01", status: "Active", category: "existing", phone: "0818-3456-7896" },
  { id: "EMP-008", nik: "NIK-2019-008", name: "Dewi Lestari", email: "dewi@company.com", department: "HRD", position: "HR Specialist", level: "L3", joinDate: "2019-08-20", status: "Active", category: "existing", phone: "0819-3456-7897" },
  { id: "EMP-009", nik: "NIK-2021-009", name: "Eko Prasetyo", email: "eko@company.com", department: "Finance", position: "Finance Manager", level: "L5", joinDate: "2021-02-14", status: "Active", category: "existing", phone: "0820-3456-7898" },
  { id: "EMP-010", nik: "NIK-2023-010", name: "Fajar Nugroho", email: "fajar@company.com", department: "Engineering", position: "Junior Engineer", level: "L2", joinDate: "2023-03-01", status: "Active", category: "existing", phone: "0821-3456-7899" },
  { id: "EMP-011", nik: "NIK-2016-011", name: "Gita Prameswari", email: "gita@company.com", department: "Marketing", position: "Marketing Manager", level: "L5", joinDate: "2016-11-01", status: "Active", category: "recruitment", phone: "0822-3456-7900" },
  { id: "EMP-012", nik: "NIK-2022-012", name: "Hadi Sucipto", email: "hadi@company.com", department: "Operations", position: "Staff Operations", level: "L2", joinDate: "2022-08-15", status: "Inactive", category: "recruitment", phone: "0823-3456-7901" },
  { id: "EMP-013", nik: "NIK-2020-013", name: "Intan Permata Sari", email: "intan@company.com", department: "Engineering", position: "Software Engineer", level: "L3", joinDate: "2020-05-20", status: "Active", category: "existing", phone: "0824-3456-7902" },
  { id: "EMP-014", nik: "NIK-2018-014", name: "Joko Widodo", email: "joko@company.com", department: "Operations", position: "Operations Manager", level: "L5", joinDate: "2018-01-10", status: "Active", category: "existing", phone: "0825-3456-7903" },
  { id: "EMP-015", nik: "NIK-2023-015", name: "Kartika Sari Dewi", email: "kartika@company.com", department: "Finance", position: "Finance Analyst", level: "L3", joinDate: "2023-06-01", status: "Active", category: "recruitment", phone: "0826-3456-7904" },
]

export const frameworks: Framework[] = [
  {
    id: "FW-001",
    name: "Template Kepemimpinan PLN",
    isTemplate: true,
    createdAt: "2026-05-01",
    updatedAt: "2026-05-15",
    competencies: [
      {
        id: "COMP-001",
        name: "Kepemimpinan",
        description: "Kemampuan memimpin tim dan mengarahkan bawahan mencapai tujuan organisasi",
        levels: [
          { level: 1, label: "Pemula", indicator: "Mampu mengikuti instruksi dan menyelesaikan tugas individual" },
          { level: 2, label: "Dasar", indicator: "Mampu mengkoordinasi 2-3 orang dalam tugas sederhana" },
          { level: 3, label: "Madya", indicator: "Mampu memimpin tim 5-10 orang dengan target jelas" },
          { level: 4, label: "Lanjut", indicator: "Mampu memimpin multiple tim dan meresolusi konflik" },
          { level: 5, label: "Ahli", indicator: "Mampu memimpin organisasi dan mengembangkan pemimpin lain" },
        ],
      },
      {
        id: "COMP-002",
        name: "Analisis Strategis",
        description: "Kemampuan menganalisis situasi kompleks dan menyusun strategi",
        levels: [
          { level: 1, label: "Pemula", indicator: "Mampu mengidentifikasi masalah sederhana" },
          { level: 2, label: "Dasar", indicator: "Mampu menganalisis data dengan bimbingan" },
          { level: 3, label: "Madya", indicator: "Mampu menyusun rekomendasi berdasarkan analisis data" },
          { level: 4, label: "Lanjut", indicator: "Mampu menyusun strategi jangka menengah untuk departemen" },
          { level: 5, label: "Ahli", indicator: "Mampu menyusun strategi korporasi jangka panjang" },
        ],
      },
      {
        id: "COMP-003",
        name: "Komunikasi",
        description: "Kemampuan menyampaikan ide dan informasi secara efektif",
        levels: [
          { level: 1, label: "Pemula", indicator: "Mampu menyampaikan informasi faktual secara lisan" },
          { level: 2, label: "Dasar", indicator: "Mampu membuat presentasi sederhana dan laporan tertulis" },
          { level: 3, label: "Madya", indicator: "Mampu presentasi di depan audiens 20+ orang" },
          { level: 4, label: "Lanjut", indicator: "Mampu negosiasi dan mempengaruhi stakeholder kunci" },
          { level: 5, label: "Ahli", indicator: "Mampu menjadi juru bicara organisasi dan crisis communicator" },
        ],
      },
      {
        id: "COMP-004",
        name: "Inovasi",
        description: "Kemampuan menciptakan solusi baru dan mendorong perubahan",
        levels: [
          { level: 1, label: "Pemula", indicator: "Menerima perubahan dan mencoba metode baru" },
          { level: 2, label: "Dasar", indicator: "Mengusulkan perbaikan pada proses yang ada" },
          { level: 3, label: "Madya", indicator: "Mengimplementasikan solusi baru yang terukur dampaknya" },
          { level: 4, label: "Lanjut", indicator: "Menciptakan framework/sistem baru untuk organisasi" },
          { level: 5, label: "Ahli", indicator: "Mendorong budaya inovasi di tingkat organisasi" },
        ],
      },
      {
        id: "COMP-005",
        name: "Integritas",
        description: "Kemampuan bertindak konsisten dengan nilai dan etika organisasi",
        levels: [
          { level: 1, label: "Pemula", indicator: "Mematuhi aturan dan prosedur dasar" },
          { level: 2, label: "Dasar", indicator: "Menunjukkan kejujuran dalam pelaporan dan data" },
          { level: 3, label: "Madya", indicator: "Berani menyampaikan kebenaran meskipun tidak populer" },
          { level: 4, label: "Lanjut", indicator: "Menjadi role model integritas di departemen" },
          { level: 5, label: "Ahli", indicator: "Membangun sistem yang mendukung budaya etis" },
        ],
      },
      {
        id: "COMP-006",
        name: "Kolaborasi",
        description: "Kemampuan bekerja sama dalam tim dan lintas fungsi",
        levels: [
          { level: 1, label: "Pemula", indicator: "Berpartisipasi dalam diskusi tim" },
          { level: 2, label: "Dasar", indicator: "Berkontribusi aktif dalam proyek tim" },
          { level: 3, label: "Madya", indicator: "Memfasilitasi kolaborasi lintas tim" },
          { level: 4, label: "Lanjut", indicator: "Membangun jaringan dan aliansi strategis" },
          { level: 5, label: "Ahli", indicator: "Mengelola kemitraan dan ekosistem kolaboratif" },
        ],
      },
    ],
  },
  {
    id: "FW-002",
    name: "Framework Engineering Astra",
    isTemplate: true,
    createdAt: "2026-04-15",
    updatedAt: "2026-05-10",
    competencies: [
      {
        id: "COMP-007",
        name: "Technical Leadership",
        description: "Kemampuan memimpin tim teknis dan pengambilan keputusan arsitektur",
        levels: [
          { level: 1, label: "Pemula", indicator: "Memahami arsitektur sistem yang ada" },
          { level: 2, label: "Dasar", indicator: "Mampu mereview code dan memberikan masukan teknis" },
          { level: 3, label: "Madya", indicator: "Mampu mendesain arsitektur modul/subsistem" },
          { level: 4, label: "Lanjut", indicator: "Mampu mendesain arsitektur sistem end-to-end" },
          { level: 5, label: "Ahli", indicator: "Mampu menentukan technology roadmap organisasi" },
        ],
      },
      {
        id: "COMP-008",
        name: "Problem Solving",
        description: "Kemampuan memecahkan masalah teknis kompleks",
        levels: [
          { level: 1, label: "Pemula", indicator: "Menyelesaikan bug sederhana dengan panduan" },
          { level: 2, label: "Dasar", indicator: "Mendiagnosis dan memperbaiki issue umum secara mandiri" },
          { level: 3, label: "Madya", indicator: "Memecahkan masalah kompleks dengan analisis sistematis" },
          { level: 4, label: "Lanjut", indicator: "Mengembangkan framework troubleshooting untuk tim" },
          { level: 5, label: "Ahli", indicator: "Menangani crisis system dan post-mortem analysis" },
        ],
      },
    ],
  },
  {
    id: "FW-003",
    name: "Framework Assessment Marketing",
    isTemplate: false,
    createdAt: "2026-05-18",
    updatedAt: "2026-05-20",
    competencies: [
      {
        id: "COMP-009",
        name: "Marketing Strategy",
        description: "Kemampuan menyusun dan mengeksekusi strategi marketing",
        levels: [
          { level: 1, label: "Pemula", indicator: "Menjalankan task marketing sesuai brief" },
          { level: 2, label: "Dasar", indicator: "Menyusun rencana marketing bulanan" },
          { level: 3, label: "Madya", indicator: "Menyusun go-to-market strategy untuk produk baru" },
          { level: 4, label: "Lanjut", indicator: "Mengelola integrated marketing campaign 360" },
          { level: 5, label: "Ahli", indicator: "Menyusun corporate branding strategy" },
        ],
      },
      {
        id: "COMP-010",
        name: "Data-Driven Marketing",
        description: "Kemampuan menggunakan data untuk pengambilan keputusan marketing",
        levels: [
          { level: 1, label: "Pemula", indicator: "Membaca laporan analytics dasar" },
          { level: 2, label: "Dasar", indicator: "Menganalisis campaign performance" },
          { level: 3, label: "Madya", indicator: "Mengoptimalkan campaign berdasarkan A/B testing" },
          { level: 4, label: "Lanjut", indicator: "Membangun marketing attribution model" },
          { level: 5, label: "Ahli", indicator: "Mengembangkan predictive marketing models" },
        ],
      },
    ],
  },
]

export const batches: Batch[] = [
  {
    id: "BATCH-001",
    name: "Assessment Manager Engineering",
    position: "Manager Engineering",
    department: "Engineering",
    status: "Active",
    frameworkId: "FW-002",
    frameworkName: "Framework Engineering Astra",
    deadline: "2026-06-15",
    candidateCount: 4,
    completedCount: 2,
    createdAt: "2026-05-10",
    createdBy: "Sari Dewi",
    assignedEmployeeIds: ["EMP-001", "EMP-002", "EMP-004", "EMP-005"],
  },
  {
    id: "BATCH-002",
    name: "Promosi Supervisor Marketing",
    position: "Supervisor Marketing",
    department: "Marketing",
    status: "Active",
    frameworkId: "FW-003",
    frameworkName: "Framework Assessment Marketing",
    deadline: "2026-06-20",
    candidateCount: 3,
    completedCount: 1,
    createdAt: "2026-05-12",
    createdBy: "Dian Permata",
    assignedEmployeeIds: ["EMP-006", "EMP-003"],
  },
  {
    id: "BATCH-003",
    name: "Hiring Senior Developer",
    position: "Senior Software Developer",
    department: "Engineering",
    status: "Draft",
    frameworkId: "FW-002",
    frameworkName: "Framework Engineering Astra",
    deadline: "2026-07-01",
    candidateCount: 2,
    completedCount: 0,
    createdAt: "2026-05-20",
    createdBy: "Ahmad Rizki",
    assignedEmployeeIds: ["EMP-001"],
  },
  {
    id: "BATCH-004",
    name: "Assessment Calon Manager",
    position: "Manager",
    department: "Operations",
    status: "Completed",
    frameworkId: "FW-001",
    frameworkName: "Template Kepemimpinan PLN",
    deadline: "2026-05-10",
    candidateCount: 3,
    completedCount: 3,
    createdAt: "2026-04-20",
    createdBy: "Sari Dewi",
    assignedEmployeeIds: ["EMP-005", "EMP-006", "EMP-002"],
  },
  {
    id: "BATCH-005",
    name: "Promosi Lead Finance",
    position: "Finance Team Lead",
    department: "Finance",
    status: "Completed",
    frameworkId: "FW-001",
    frameworkName: "Template Kepemimpinan PLN",
    deadline: "2026-04-30",
    candidateCount: 1,
    completedCount: 1,
    createdAt: "2026-04-01",
    createdBy: "Ahmad Rizki",
    assignedEmployeeIds: ["EMP-003"],
  },
]

export const candidates: Candidate[] = [
  {
    id: "CAND-001",
    batchId: "BATCH-001",
    accessCode: "RK4821",
    name: "Rudi Hartono",
    email: "rudi.hartono@company.com",
    position: "Senior Engineer",
    department: "Engineering",
    isExternal: false,
    status: "Completed",
    hrDecision: "Promote",
    aiRecommendation: "Promote",
    aiSummary: {
      generatedAt: "2026-05-15 14:35",
      overview: "Rudi Hartono menunjukkan profil kompetensi yang kuat untuk posisi Manager Engineering. Skor blended rata-rata 3.9 dengan konsistensi tinggi antara evidence dokumenter dan performa roleplay. Kandidat siap dipromosikan dengan fokus pengembangan pada aspek people management jangka panjang.",
      strengths: [
        "Problem solving di level lanjut (4.1) dengan track record incident response terdokumentasi",
        "Technical leadership solid (3.7) — memimpin migrasi sistem dan keputusan arsitektur",
        "Komunikasi empatik dan solusi-oriented dalam simulasi konflik tim",
      ],
      developmentAreas: [
        "Memperdalam coaching untuk retensi talenta jangka panjang",
        "Meningkatkan delegasi strategis agar tidak terlalu hands-on pada detail teknis",
      ],
      evidenceHighlights: "3 dokumen evidence (CV, sertifikat AWS, portfolio) mendukung pengalaman kepemimpinan teknis dan analisis post-mortem insiden produksi.",
      roleplayHighlights: "Dalam simulasi burnout anggota tim senior, kandidat merespons dengan empati, langkah konkret (redistribusi workload, cuti), dan komitmen follow-up terstruktur.",
      recommendationRationale: "Rekomendasi Promote didasarkan pada skor blended ≥3.5 di semua kompetensi target, confidence rata-rata 88%, serta alignment kuat antara evidence dan roleplay. Gap positif pada Technical Leadership (+0.3) masih dalam toleransi untuk level manajerial.",
    },
    competencyProfile: {
      scores: [
        { competencyId: "COMP-007", competencyName: "Technical Leadership", evidenceScore: 3.5, roleplayScore: 3.8, blendedScore: 3.7, confidence: 0.85, justification: "Menunjukkan kemampuan memimpin diskusi teknis dan review code. Dalam roleplay, mampu mengambil keputusan arsitektur dengan tepat.", evidenceExcerpt: "CV: Memimpin 3 project migrasi sistem. Sertifikat: AWS Solutions Architect.", gap: 0.3 },
        { competencyId: "COMP-008", competencyName: "Problem Solving", evidenceScore: 4.0, roleplayScore: 4.2, blendedScore: 4.1, confidence: 0.92, justification: "Evidence menunjukkan track record kuat dalam menyelesaikan incident produksi. Roleplay: pendekatan sistematis dan tenang.", evidenceExcerpt: "Portfolio: Post-mortem analysis 5 major incidents.", gap: -0.1 },
      ],
      blendedAt: "2026-05-15 14:30",
      snapshot: true,
    },
  },
  {
    id: "CAND-002",
    batchId: "BATCH-001",
    accessCode: "MY7392",
    name: "Maya Indah",
    email: "maya.indah@company.com",
    position: "Software Engineer",
    department: "Marketing",
    isExternal: false,
    status: "Completed",
    aiRecommendation: "Not Yet",
    aiSummary: {
      generatedAt: "2026-05-16 09:20",
      overview: "Maya Indah menunjukkan potensi teknis yang memadai namun belum memenuhi threshold kepemimpinan untuk promosi ke Manager Engineering. Skor blended rata-rata 2.95 dengan gap signifikan pada Technical Leadership.",
      strengths: [
        "Problem solving dasar cukup kompeten (3.1)",
        "Responsif terhadap perubahan teknologi dalam simulasi migrasi sistem",
      ],
      developmentAreas: [
        "Technical leadership — perlu pengalaman memimpin tim minimal 1–2 tahun",
        "Pendekatan problem solving yang lebih sistematis dan terdokumentasi",
        "Kepercayaan diri dalam mengambil keputusan under pressure",
      ],
      evidenceHighlights: "CV menunjukkan pengalaman 2 tahun sebagai individual contributor tanpa bukti memimpin tim.",
      roleplayHighlights: "Dalam simulasi resistensi migrasi, kandidat memberikan argumen berbasis data namun kurang persuasif mengarahkan skeptisisme tim.",
      recommendationRationale: "Rekomendasi Not Yet karena Technical Leadership (2.8) berada di bawah threshold 3.0 untuk level manajerial, dengan gap +1.2 dari target role. Disarankan program mentoring 6–12 bulan sebelum reassessment.",
    },
    competencyProfile: {
      scores: [
        { competencyId: "COMP-007", competencyName: "Technical Leadership", evidenceScore: 2.5, roleplayScore: 3.0, blendedScore: 2.8, confidence: 0.78, justification: "Memiliki basic technical leadership, namun masih perlu pengalaman dalam memimpin tim.", evidenceExcerpt: "CV: 2 tahun sebagai engineer individu.", gap: 1.2 },
        { competencyId: "COMP-008", competencyName: "Problem Solving", evidenceScore: 3.0, roleplayScore: 3.2, blendedScore: 3.1, confidence: 0.81, justification: "Problem solving cukup baik, namun masih perlu mengembangkan pendekatan sistematis.", evidenceExcerpt: "Referensi: 'Baik dalam troubleshooting basic issue'", gap: 0.9 },
      ],
      blendedAt: "2026-05-16 09:15",
      snapshot: true,
    },
  },
  {
    id: "CAND-003",
    batchId: "BATCH-001",
    accessCode: "FT5618",
    name: "Fitri Handayani",
    email: "fitri.handayani@company.com",
    position: "Senior Engineer",
    department: "Engineering",
    isExternal: false,
    status: "Uploading",
  },
  {
    id: "CAND-004",
    batchId: "BATCH-001",
    accessCode: "DN2947",
    name: "Denny Saputra",
    email: "denny.saputra@company.com",
    position: "Engineer",
    department: "Operations",
    isExternal: false,
    status: "Roleplay",
  },
  {
    id: "CAND-005",
    batchId: "BATCH-002",
    accessCode: "RM8156",
    name: "Rina Mariana",
    email: "rina.mariana@company.com",
    position: "Marketing Associate",
    department: "Marketing",
    isExternal: false,
    status: "Completed",
    aiRecommendation: "Promote",
    aiSummary: {
      generatedAt: "2026-05-17 11:05",
      overview: "Rina Mariana menunjukkan kompetensi marketing yang kuat dan konsisten untuk promosi ke Supervisor Marketing. Skor blended rata-rata 3.75 dengan performa roleplay yang melampaui evidence pada Marketing Strategy.",
      strengths: [
        "Marketing Strategy excellent (3.9) — campaign reach +45% YoY terdokumentasi",
        "Strategi go-to-market solid dalam simulasi roleplay",
        "Sertifikasi Google Analytics mendukung data-driven approach",
      ],
      developmentAreas: [
        "Data-Driven Marketing (3.6) — tingkatkan kedalaman A/B testing dan attribution modeling",
      ],
      evidenceHighlights: "Portfolio dan sertifikasi analytics mendukung track record campaign yang terukur.",
      roleplayHighlights: "Mampu menyusun strategi GTM yang persuasif dan merespons objection stakeholder dengan data.",
      recommendationRationale: "Rekomendasi Promote berdasarkan skor blended ≥3.5 di semua kompetensi target framework marketing dengan confidence rata-rata 85%.",
    },
    competencyProfile: {
      scores: [
        { competencyId: "COMP-009", competencyName: "Marketing Strategy", evidenceScore: 3.8, roleplayScore: 4.0, blendedScore: 3.9, confidence: 0.88, justification: "Pengalaman kuat dalam campaign planning. Roleplay: strategi go-to-market yang solid.", evidenceExcerpt: "Portfolio: Campaign reach +45% YoY", gap: 0.1 },
        { competencyId: "COMP-010", competencyName: "Data-Driven Marketing", evidenceScore: 3.5, roleplayScore: 3.6, blendedScore: 3.6, confidence: 0.82, justification: "Menguasai analytics tools dan A/B testing methodology.", evidenceExcerpt: "CV: Google Analytics certified", gap: 0.4 },
      ],
      blendedAt: "2026-05-17 11:00",
      snapshot: true,
    },
  },
  {
    id: "CAND-006",
    batchId: "BATCH-002",
    accessCode: "AW3472",
    name: "Agus Wijaya",
    email: "agus.wijaya@company.com",
    position: "Marketing Associate",
    department: "Finance",
    isExternal: false,
    status: "Menunggu",
  },
  {
    id: "CAND-007",
    batchId: "BATCH-002",
    accessCode: "HG9205",
    name: "Hendra Gunawan",
    email: "hendra.ext@external.com",
    position: "N/A (Eksternal)",
    department: "Engineering",
    isExternal: true,
    status: "Uploading",
  },
  {
    id: "CAND-008",
    batchId: "BATCH-003",
    accessCode: "SP1634",
    name: "Sarah Putri",
    email: "sarah.ext@external.com",
    position: "N/A (Eksternal)",
    department: "Product",
    isExternal: true,
    status: "Menunggu",
  },
  {
    id: "CAND-009",
    batchId: "BATCH-003",
    accessCode: "RH7821",
    name: "Rudi Hartono",
    email: "rudi.hartono@company.com",
    position: "Senior Engineer",
    department: "Engineering",
    isExternal: false,
    status: "Menunggu",
  },
  {
    id: "CAND-010",
    batchId: "BATCH-004",
    accessCode: "DS6039",
    name: "Denny Saputra",
    email: "denny.saputra@company.com",
    position: "Supervisor Operations",
    department: "Operations",
    isExternal: false,
    status: "Completed",
    aiRecommendation: "Promote",
    hrDecision: "Promote",
    competencyProfile: {
      scores: [
        { competencyId: "COMP-001", competencyName: "Kepemimpinan", evidenceScore: 3.2, roleplayScore: 3.5, blendedScore: 3.4, confidence: 0.8, justification: "Menunjukkan potensi kepemimpinan. Roleplay: mampu meresolusi konflik tim.", gap: 0.6 },
        { competencyId: "COMP-002", competencyName: "Analisis Strategis", evidenceScore: 3.5, roleplayScore: 3.0, blendedScore: 3.2, confidence: 0.75, justification: "Analisis cukup baik namun masih perlu pengembangan strategic thinking.", gap: 0.8 },
        { competencyId: "COMP-003", competencyName: "Komunikasi", evidenceScore: 4.0, roleplayScore: 3.8, blendedScore: 3.9, confidence: 0.88, justification: "Komunikator yang baik, mampu presentasi dengan jelas.", gap: 0.1 },
        { competencyId: "COMP-004", competencyName: "Inovasi", evidenceScore: 2.8, roleplayScore: 3.2, blendedScore: 3.0, confidence: 0.72, justification: "Cukup inovatif, perlu didorong untuk lebih proaktif.", gap: 1.0 },
        { competencyId: "COMP-005", competencyName: "Integritas", evidenceScore: 4.5, roleplayScore: 4.5, blendedScore: 4.5, confidence: 0.95, justification: "Track record integritas sangat baik. Tidak ada catatan pelanggaran.", gap: -0.5 },
        { competencyId: "COMP-006", competencyName: "Kolaborasi", evidenceScore: 3.8, roleplayScore: 4.0, blendedScore: 3.9, confidence: 0.85, justification: "Kolaborator yang baik, dihormati rekan kerja.", gap: 0.1 },
      ],
      blendedAt: "2026-05-08 16:00",
      snapshot: true,
    },
  },
  {
    id: "CAND-011",
    batchId: "BATCH-004",
    accessCode: "RM4567",
    name: "Rina Mariana",
    email: "rina.mariana@company.com",
    position: "Supervisor Marketing",
    department: "Marketing",
    isExternal: false,
    status: "Completed",
    aiRecommendation: "Not Yet",
    hrDecision: "Not Yet",
    competencyProfile: {
      scores: [
        { competencyId: "COMP-001", competencyName: "Kepemimpinan", evidenceScore: 2.5, roleplayScore: 2.8, blendedScore: 2.7, confidence: 0.75, justification: "Leadership masih perlu dikembangkan. Roleplay: ragu-ragu dalam mengambil keputusan.", gap: 1.3 },
        { competencyId: "COMP-002", competencyName: "Analisis Strategis", evidenceScore: 3.0, roleplayScore: 2.5, blendedScore: 2.7, confidence: 0.7, justification: "Analisis masih terbatas pada data operasional.", gap: 1.3 },
        { competencyId: "COMP-003", competencyName: "Komunikasi", evidenceScore: 3.5, roleplayScore: 3.5, blendedScore: 3.5, confidence: 0.8, justification: "Komunikasi baik, mampu menyampaikan ide dengan jelas.", gap: 0.5 },
        { competencyId: "COMP-004", competencyName: "Inovasi", evidenceScore: 3.0, roleplayScore: 3.2, blendedScore: 3.1, confidence: 0.73, justification: "Inisiatif inovasi ada tapi belum terstruktur.", gap: 0.9 },
        { competencyId: "COMP-005", competencyName: "Integritas", evidenceScore: 4.0, roleplayScore: 4.0, blendedScore: 4.0, confidence: 0.9, justification: "Integritas terjaga baik.", gap: 0.0 },
        { competencyId: "COMP-006", competencyName: "Kolaborasi", evidenceScore: 3.8, roleplayScore: 3.5, blendedScore: 3.6, confidence: 0.82, justification: "Kolaborasi baik, aktif dalam teamwork.", gap: 0.4 },
      ],
      blendedAt: "2026-05-08 16:30",
      snapshot: true,
    },
  },
  {
    id: "CAND-012",
    batchId: "BATCH-004",
    accessCode: "MI2841",
    name: "Maya Indah",
    email: "maya.indah@company.com",
    position: "Marketing Associate",
    department: "Marketing",
    isExternal: false,
    status: "Completed",
    aiRecommendation: "Promote",
    hrDecision: "Promote",
    competencyProfile: {
      scores: [
        { competencyId: "COMP-001", competencyName: "Kepemimpinan", evidenceScore: 3.5, roleplayScore: 4.0, blendedScore: 3.8, confidence: 0.86, justification: "Potential leader. Roleplay: mampu memotivasi dan mengarahkan.", gap: 0.2 },
        { competencyId: "COMP-002", competencyName: "Analisis Strategis", evidenceScore: 3.8, roleplayScore: 3.5, blendedScore: 3.6, confidence: 0.82, justification: "Analitis dan mampu melihat big picture.", gap: 0.4 },
        { competencyId: "COMP-003", competencyName: "Komunikasi", evidenceScore: 4.2, roleplayScore: 4.5, blendedScore: 4.4, confidence: 0.93, justification: "Komunikator excellent. Mampu mempengaruhi stakeholder.", gap: -0.4 },
        { competencyId: "COMP-004", competencyName: "Inovasi", evidenceScore: 3.5, roleplayScore: 4.0, blendedScore: 3.8, confidence: 0.83, justification: "Inovatif dan selalu mencari improvement.", gap: 0.2 },
        { competencyId: "COMP-005", competencyName: "Integritas", evidenceScore: 4.0, roleplayScore: 4.5, blendedScore: 4.3, confidence: 0.91, justification: "Integritas tinggi. Dapat dipercaya.", gap: -0.3 },
        { competencyId: "COMP-006", competencyName: "Kolaborasi", evidenceScore: 4.0, roleplayScore: 4.2, blendedScore: 4.1, confidence: 0.88, justification: "Sangat kolaboratif. Dihormati lintas tim.", gap: -0.1 },
      ],
      blendedAt: "2026-05-09 09:00",
      snapshot: true,
    },
  },
  {
    id: "CAND-013",
    batchId: "BATCH-005",
    accessCode: "AW5912",
    name: "Agus Wijaya",
    email: "agus.wijaya@company.com",
    position: "Finance Analyst",
    department: "Finance",
    isExternal: false,
    status: "Completed",
    aiRecommendation: "Promote",
    hrDecision: "Promote",
    competencyProfile: {
      scores: [
        { competencyId: "COMP-001", competencyName: "Kepemimpinan", evidenceScore: 3.0, roleplayScore: 3.5, blendedScore: 3.3, confidence: 0.78, justification: "Leadership cukup, perlu pengalaman lebih.", gap: 0.7 },
        { competencyId: "COMP-002", competencyName: "Analisis Strategis", evidenceScore: 4.0, roleplayScore: 3.8, blendedScore: 3.9, confidence: 0.87, justification: "Analisis finansial sangat kuat.", gap: 0.1 },
        { competencyId: "COMP-003", competencyName: "Komunikasi", evidenceScore: 3.0, roleplayScore: 3.2, blendedScore: 3.1, confidence: 0.74, justification: "Komunikasi perlu ditingkatkan terutama presentasi.", gap: 0.9 },
        { competencyId: "COMP-004", competencyName: "Inovasi", evidenceScore: 2.5, roleplayScore: 3.0, blendedScore: 2.8, confidence: 0.68, justification: "Inovasi terbatas, cenderung mengikuti prosedur.", gap: 1.2 },
        { competencyId: "COMP-005", competencyName: "Integritas", evidenceScore: 4.5, roleplayScore: 4.5, blendedScore: 4.5, confidence: 0.95, justification: "Integritas sempurna. Dipercaya menangani财务.", gap: -0.5 },
        { competencyId: "COMP-006", competencyName: "Kolaborasi", evidenceScore: 3.5, roleplayScore: 3.5, blendedScore: 3.5, confidence: 0.8, justification: "Kolaborasi baik dalam tim finance.", gap: 0.5 },
      ],
      blendedAt: "2026-04-28 13:00",
      snapshot: true,
    },
  },
]

export const evidenceFiles: EvidenceFile[] = [
  { id: "EVID-001", candidateId: "CAND-001", name: "CV_Rudi_Hartono.pdf", type: "PDF", size: "2.4 MB", status: "completed", uploadedAt: "2026-05-12 08:15" },
  { id: "EVID-002", candidateId: "CAND-001", name: "Sertifikat_AWS.pdf", type: "PDF", size: "1.1 MB", status: "completed", uploadedAt: "2026-05-12 08:20" },
  { id: "EVID-003", candidateId: "CAND-001", name: "Portfolio_Rudi.pdf", type: "PDF", size: "5.2 MB", status: "completed", uploadedAt: "2026-05-12 08:25" },
  { id: "EVID-004", candidateId: "CAND-002", name: "CV_Maya_Indah.pdf", type: "PDF", size: "1.8 MB", status: "completed", uploadedAt: "2026-05-13 10:00" },
  { id: "EVID-005", candidateId: "CAND-003", name: "CV_Fitri_Handayani.pdf", type: "PDF", size: "2.1 MB", status: "processing", uploadedAt: "2026-05-19 14:00" },
  { id: "EVID-006", candidateId: "CAND-003", name: "Sertifikat_PMP.pdf", type: "PDF", size: "0.9 MB", status: "uploaded", uploadedAt: "2026-05-19 14:05" },
  { id: "EVID-007", candidateId: "CAND-005", name: "CV_Rina_Mariana.pdf", type: "PDF", size: "1.5 MB", status: "completed", uploadedAt: "2026-05-14 09:30" },
  { id: "EVID-008", candidateId: "CAND-005", name: "Sertifikat_Google_Analytics.pdf", type: "PDF", size: "0.8 MB", status: "completed", uploadedAt: "2026-05-14 09:35" },
]

export const roleplaySessions: RoleplaySession[] = [
  {
    id: "RP-001",
    candidateId: "CAND-001",
    scenario: "Anda adalah Manager Engineering yang baru dipromosikan. Tim Anda sedang menghadapi deadline ketat, dan salah satu anggota tim senior Anda mengancam akan resign karena burnout. Bagaimana Anda menghadapi situasi ini?",
    competency: "Kepemimpinan",
    status: "completed",
    startedAt: "2026-05-15 10:00",
    completedAt: "2026-05-15 10:30",
    messages: [
      { id: "MSG-001", sessionId: "RP-001", sender: "ai", content: "Halo Rudi, saya adalah anggota tim senior Anda. Saya ingin bicara serius. Saya sudah kelelahan dengan beban kerja akhir-akhir ini. Deadline yang bertubi-tubi membuat saya stres dan saya mulai mempertimbangkan untuk resign. Saya rasa saya sudah tidak bisa diandalkan lagi untuk tim ini.", timestamp: "2026-05-15 10:00" },
      { id: "MSG-002", sessionId: "RP-001", sender: "candidate", content: "Terima kasih sudah jujur dengan saya. Saya sangat menghargai keterbukaan Anda. Sebelum kita bahas lebih lanjut, saya ingin Anda tahu bahwa kontribusi Anda selama ini sangat berarti bagi tim. Mari kita bicara satu per satu. Bisakah Anda ceritakan apa yang paling membebani Anda akhir-akhir ini?", timestamp: "2026-05-15 10:02" },
      { id: "MSG-003", sessionId: "RP-001", sender: "ai", content: "Beban kerjanya tidak realistis. Saya handle 3 project sekaligus, dengan 2 di antaranya memiliki deadline di minggu yang sama. Saya sudah sampaikan ke manajemen sebelumnya tapi tidak ada perubahan. Saya lelah secara fisik dan mental.", timestamp: "2026-05-15 10:03" },
      { id: "MSG-004", sessionId: "RP-001", sender: "candidate", content: "Saya mengerti. Ini jelas masalah serius dan saya tidak akan menganggap enteng. Mulai hari ini, mari kita lakukan beberapa hal: Pertama, saya akan redistribusi workload Anda dengan tim lain. Kedua, kita akan prioritaskan project mana yang benar-benar critical. Ketiga, saya akan bicara dengan VP Engineering untuk menambah headcount atau memperpanjang deadline. Saya juga ingin Anda mengambil 2 hari cuti untuk recharge. Bagaimana menurut Anda?", timestamp: "2026-05-15 10:06" },
      { id: "MSG-005", sessionId: "RP-001", sender: "ai", content: "Saya appreciate langkah konkretnya. Tapi saya ragu apakah ini akan bertahan lama atau hanya sementara. Saya sudah kecewa beberapa kali.", timestamp: "2026-05-15 10:07" },
      { id: "MSG-006", sessionId: "RP-001", sender: "candidate", content: "Saya paham kenapa Anda skeptis. Biarkan saya buktikan dengan tindakan. Saya akan buat rencana aksi tertulis dalam 2 hari ke depan dengan timeline yang jelas. Kita akan review setiap minggu untuk memastikan perubahan ini berjalan. Tidak ada lagi janji kosong. Saya berkomitmen untuk membuat lingkungan kerja yang lebih sehat untuk tim kita.", timestamp: "2026-05-15 10:10" },
    ],
  },
  {
    id: "RP-002",
    candidateId: "CAND-002",
    scenario: "Anda mendapat tugas untuk memimpin project migrasi sistem lama ke platform baru. Tim Anda resisten terhadap perubahan dan lebih nyaman dengan sistem lama. Bagaimana Anda memimpin perubahan ini?",
    competency: "Technical Leadership",
    status: "completed",
    startedAt: "2026-05-16 08:00",
    completedAt: "2026-05-16 08:25",
    messages: [
      { id: "MSG-007", sessionId: "RP-002", sender: "ai", content: "Saya dengar kita akan migrasi ke platform baru. Jujur saya sudah nyaman dengan sistem lama. Belajar sistem baru itu buang-buang waktu dan bikin produktivitas turun. Apa urgensi sebenarnya?", timestamp: "2026-05-16 08:00" },
      { id: "MSG-008", sessionId: "RP-002", sender: "candidate", content: "Saya paham kekhawatirannya. Tapi mari kita lihat datanya: sistem lama kita sudah 3 kali downtime dalam 6 bulan terakhir, dan maintenance cost naik 40% year-on-year. Saya akan arrange training bertahap, jadi tidak perlu belajar semuanya sekaligus.", timestamp: "2026-05-16 08:03" },
    ],
  },
]

export const auditLogs: AuditEntry[] = [
  { id: "AUD-001", userId: "USR-002", userName: "Sari Dewi", action: "LOGIN", entity: "User", entityId: "USR-002", details: "Login via Google OAuth", timestamp: "2026-05-20 07:45:00", ipAddress: "192.168.1.100" },
  { id: "AUD-002", userId: "USR-001", userName: "Budi Santoso", action: "LOGIN", entity: "User", entityId: "USR-001", details: "Login via email/password", timestamp: "2026-05-20 08:30:00", ipAddress: "192.168.1.50" },
  { id: "AUD-003", userId: "USR-002", userName: "Sari Dewi", action: "CREATE", entity: "Batch", entityId: "BATCH-003", details: "Membuat batch 'Hiring Senior Developer'", timestamp: "2026-05-20 08:00:00", ipAddress: "192.168.1.100" },
  { id: "AUD-004", userId: "USR-004", userName: "Dian Permata", action: "CREATE", entity: "Framework", entityId: "FW-003", details: "Membuat framework 'Framework Assessment Marketing'", timestamp: "2026-05-18 09:15:00", ipAddress: "192.168.1.102" },
  { id: "AUD-005", userId: "USR-002", userName: "Sari Dewi", action: "ASSIGN", entity: "Candidate", entityId: "CAND-003", details: "Assign Fitri Handayani ke batch BATCH-001", timestamp: "2026-05-18 10:00:00", ipAddress: "192.168.1.100" },
  { id: "AUD-006", userId: "USR-003", userName: "Ahmad Rizki", action: "FINALIZE", entity: "Batch", entityId: "BATCH-005", details: "Finalisasi batch 'Promosi Lead Finance'", timestamp: "2026-05-10 15:00:00", ipAddress: "192.168.1.101" },
  { id: "AUD-007", userId: "USR-003", userName: "Ahmad Rizki", action: "DECISION", entity: "Candidate", entityId: "CAND-013", details: "Keputusan: Promote (setuju dengan AI)", timestamp: "2026-05-10 15:30:00", ipAddress: "192.168.1.101" },
  { id: "AUD-008", userId: "USR-004", userName: "Dian Permata", action: "DECISION", entity: "Candidate", entityId: "CAND-005", details: "Keputusan: Promote (override AI - alasan: 'Kandidat menunjukkan peningkatan signifikan dalam 6 bulan terakhir, melebihi ekspektasi untuk posisi ini')", timestamp: "2026-05-17 14:00:00", ipAddress: "192.168.1.102" },
  { id: "AUD-009", userId: "USR-004", userName: "Dian Permata", action: "LOGIN", entity: "User", entityId: "USR-004", details: "Login failed (wrong password)", timestamp: "2026-05-17 08:00:00", ipAddress: "192.168.1.200" },
  { id: "AUD-010", userId: "USR-002", userName: "Sari Dewi", action: "UPDATE", entity: "Framework", entityId: "FW-001", details: "Update kompetensi 'Inovasi' level descriptors", timestamp: "2026-05-15 09:00:00", ipAddress: "192.168.1.100" },
  { id: "AUD-011", userId: "USR-005", userName: "Rudi Hartono", action: "UPLOAD", entity: "Evidence", entityId: "EVID-001", details: "Upload CV_Rudi_Hartono.pdf (2.4 MB)", timestamp: "2026-05-12 08:15:00", ipAddress: "10.0.0.50" },
  { id: "AUD-012", userId: "USR-005", userName: "Rudi Hartono", action: "UPLOAD", entity: "Evidence", entityId: "EVID-003", details: "Upload Portfolio_Rudi.pdf (5.2 MB)", timestamp: "2026-05-12 08:25:00", ipAddress: "10.0.0.50" },
]

export const decisionTypes: DecisionType[] = ["Promote", "Not Yet", "No", "Hire"]

function formatDate(d: Date): string {
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })
}

export const stats = {
  totalBatches: batches.length,
  activeBatches: batches.filter(b => b.status === "Active").length,
  totalCandidates: candidates.length,
  completedAssessments: candidates.filter(c => c.status === "Completed").length,
  pendingReview: candidates.filter(c => c.status === "Completed" && !c.hrDecision).length,
  frameworksAvailable: frameworks.length,
}
