// components/medicos/medicos-header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddMedicoDialog } from "./add-medico-dialog";

export function MedicosHeader() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Médicos</h1>
          <p className="text-sm text-muted-foreground">
            Aquí puedes ver los médicos registrados en el sistema.
          </p>
        </div>
        <AddMedicoDialog>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Agregar médico
          </Button>
        </AddMedicoDialog>
      </div>
    </div>
  );
}