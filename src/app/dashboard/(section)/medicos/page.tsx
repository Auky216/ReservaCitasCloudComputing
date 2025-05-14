// app/dashboard/medicos/page.tsx
import React from "react";
import { MedicosHeader } from "@/components/medicos/medicos-header";
import { MedicosTable } from "@/components/medicos/medicos-table";

export default function MedicosPage() {
  return (
    <div className="flex flex-col gap-4 p-5 py-4 md:gap-6 md:py-6">
      <MedicosHeader />
      <MedicosTable />
    </div>
  )
}