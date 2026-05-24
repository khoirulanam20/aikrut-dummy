import MasterDataPage from "@/components/master/MasterDataPage"
import { initialMasterDepartments } from "@/data/master"

export default function MasterDepartemen() {
  return (
    <MasterDataPage
      title="Master Departemen"
      subtitle="Kelola data departemen organisasi"
      storageKey="aikrut_master_departemen"
      initialData={initialMasterDepartments}
      codePlaceholder="ENG"
      namePlaceholder="Engineering"
    />
  )
}
