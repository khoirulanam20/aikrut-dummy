# Changelog

Semua perubahan signifikan pada proyek **aikrut-dummy** didokumentasikan di sini.

> **Catatan:** Perubahan di bawah ini berasal dari working tree Git per **24 Mei 2026** (belum di-commit; basis: `a18bbde` — first commit).  
> Statistik: **13 file diubah**, **+1.817 / −400 baris**, **6 file/folder baru**.

---

## [Unreleased] — 2026-05-24

### Batch Assessment — Create & Edit
- **Wizard 2 langkah** untuk buat batch: Informasi Batch → Assign Karyawan
- **Dua mode assign**: individu (checkbox + search/filter) atau seluruh departemen
- **Edit batch** dari list (tombol pensil / route state `editBatchId`)
- **Route state** di detail batch agar batch baru langsung tampil setelah dibuat

### Batch Detail — Kandidat & Portal
- **Daftar kandidat tunggal** menggabungkan "Karyawan yang Di-assign" dan "Progress Kandidat" (tidak redundan)
- **Filter kategori** (Semua / Existing / Rekrutmen) pada daftar kandidat
- **Ikon Share** per baris → modal berisi link portal, kode akses, token, tombol salin & buka portal
- **Kirim email** dari modal share (simulasi)
- **Checkbox bulk action**: pilih semua, kirim email massal, hapus dari batch (dengan konfirmasi)
- Data `invitationToken` & `accessCode` pada kandidat BATCH-001 di `dummy.ts`

### Detail Kandidat
- **Tab Evidence & Roleplay** diperbaiki (state tab tidak lagi hardcoded)
- **Tab Summary baru** — ringkasan AI (overview, kekuatan, area pengembangan, highlight evidence/roleplay, dasar rekomendasi)
- Interface & seed `aiSummary` untuk kandidat yang sudah selesai assessment

### Perbandingan Kandidat
- Tampilan diubah dari **tabel horizontal** ke **grid card**
- **Filter Batch Assessment** dan **Filter Departemen**
- Nama batch ditampilkan di setiap card

### Framework Kompetensi
- Layout diubah dari **tab** ke **daftar expandable** (klik baris untuk lihat kompetensi)
- **Ikon aksi per framework**: Preview, Clone, Edit, Hapus
- **Clone framework** — duplikasi kompetensi + level dengan dialog penamaan
- **Preview framework** — modal read-only ringkasan lengkap
- **Level kompetensi dapat dikustomisasi** saat tambah kompetensi (nama + indikator per level, tambah/hapus level)
- **Badge level** warna mint agar lebih kontras di background gelap
- Persistensi via `localStorage` (`aikrut_frameworks`)

### Master Data (baru)
- Menu sidebar **Master** (expandable) dengan sub-menu:
  - **Master Departemen** (`/master/departemen`)
  - **Master Posisi** (`/master/posisi`) — dropdown departemen dari master departemen
  - **Master Level Employee** (`/master/level`)
- Komponen reusable `MasterDataPage` + data seed `src/data/master.ts`

### Data Employee
- Field **`category`**: `existing` | `recruitment`
- Filter & badge kategori di tabel
- Form tambah employee: pilihan kategori
- Persistensi via `localStorage` (`aikrut_employees`)

### Portal Kandidat
- **Auto-fill token** dari query `?token=` di halaman login portal
- Persistensi evidence & roleplay ke `localStorage` (portal)

### Admin & Navigasi
- **Manajemen Pengguna**: role Kandidat dihapus dari tabel & filter
- **Sidebar**: grup Master Data + submenu; routing baru di `App.tsx`

### Infrastruktur
- Hook baru **`useLocalStorage`** (`src/hooks/use-local-storage.ts`)
- Keys localStorage:
  | Key | Halaman |
  |-----|---------|
  | `aikrut_batches` | Batch Assessment |
  | `aikrut_employees` | Data Employee |
  | `aikrut_frameworks` | Framework Kompetensi |
  | `aikrut_master_departemen` | Master Departemen |
  | `aikrut_master_posisi` | Master Posisi |
  | `aikrut_master_level` | Master Level Employee |
  | `aikrut_evidence_files` | Portal Evidence |
  | `aikrut_roleplay_messages` | Portal Roleplay |

---

### File yang diubah

| File | Ringkasan |
|------|-----------|
| `src/hooks/use-local-storage.ts` | **Baru** — hook persistensi localStorage |
| `src/data/master.ts` | **Baru** — seed master departemen, posisi, level |
| `src/data/dummy.ts` | Batch assign IDs, employee category, token portal, aiSummary kandidat |
| `src/components/master/MasterDataPage.tsx` | **Baru** — CRUD master generik |
| `src/pages/master/*.tsx` | **Baru** — 3 halaman master |
| `src/App.tsx` | Route master + import halaman baru |
| `src/components/layout/AppSidebar.tsx` | Menu Master expandable |
| `src/pages/BatchAssessment.tsx` | Wizard 2-step, edit, assign, category |
| `src/pages/BatchDetail.tsx` | List tunggal, share, bulk action, filter |
| `src/pages/CandidateDetail.tsx` | Tab aktif, Summary AI |
| `src/pages/CandidateComparison.tsx` | Card layout, filter batch & dept |
| `src/pages/FrameworkEditor.tsx` | List expandable, clone/preview, level custom |
| `src/pages/Employee.tsx` | Category filter/tag/form |
| `src/pages/admin/UserManagement.tsx` | Hapus role Kandidat |
| `src/pages/portal/PortalLogin.tsx` | Token dari URL |
| `src/pages/portal/EvidenceUpload.tsx` | localStorage |
| `src/pages/portal/RoleplaySession.tsx` | localStorage |

---

## [a18bbde] — 2026-05-24 (first commit)

- Initial commit — prototype Aikrut HR Assessment OS (dummy UI)
