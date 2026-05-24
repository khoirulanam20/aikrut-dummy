import { useMemo } from "react"
import MasterDataPage from "@/components/master/MasterDataPage"
import { initialMasterDepartments, initialMasterPositions } from "@/data/master"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { MasterDepartemen } from "@/data/master"

export default function MasterPosisi() {
  const [departments] = useLocalStorage<MasterDepartemen[]>("aikrut_master_departemen", initialMasterDepartments)

  const departmentOptions = useMemo(
    () => departments.filter((d) => d.status === "Active").map((d) => d.name),
    [departments]
  )

  return (
    <MasterDataPage
      title="Master Posisi"
      subtitle="Kelola data posisi/jabatan karyawan"
      storageKey="aikrut_master_posisi"
      initialData={initialMasterPositions}
      codePlaceholder="SE"
      namePlaceholder="Senior Engineer"
      extraFields={[
        {
          key: "department",
          label: "Departemen",
          type: "select",
          placeholder: "Pilih departemen",
          options: departmentOptions.length > 0 ? departmentOptions : ["Engineering", "Marketing", "Finance"],
        },
      ]}
    />
  )
}
