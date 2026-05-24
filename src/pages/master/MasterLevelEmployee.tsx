import MasterDataPage from "@/components/master/MasterDataPage"
import { initialMasterLevels } from "@/data/master"

export default function MasterLevelEmployee() {
  return (
    <MasterDataPage
      title="Master Level Employee"
      subtitle="Kelola level/jenjang karyawan (L2, L3, L4, ...)"
      storageKey="aikrut_master_level"
      initialData={initialMasterLevels}
      codePlaceholder="L4"
      namePlaceholder="Senior"
    />
  )
}
