// app/dashboard/medicos/page.tsx
"use client";

import React, { useCallback } from "react";
import { MedicosHeader } from "@/components/medicos/medicos-header";
import {MedicosTable}  from "@/components/medicos/medicos-table";
import { getMedicos } from "@/lib/api/medicos";
import { toast } from "sonner";

export default function MedicosPage() {
  // Función para refrescar los datos
  const refreshData = useCallback(async () => {
    try {
      await getMedicos();
      return Promise.resolve();
    } catch (error) {
      toast.error("Error", {
        description: "No se pudieron cargar los médicos."
      });
      return Promise.reject(error);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6 p-5 py-4 md:gap-8 md:py-6">
      <MedicosHeader onRefresh={refreshData} />
      
      {/* Aquí pasamos children al componente MedicosTable */}
      <MedicosTable>
        {/* Contenido que se pasará como children */}
      </MedicosTable>
      
      {/* Footer informativo */}
      <div className="text-xs text-center text-muted-foreground p-4 mt-auto">
        <p>Sistema de Gestión de Médicos v1.0</p>
        <p>Los datos mostrados son simulados para fines de desarrollo.</p>
      </div>
    </div>
  );
}