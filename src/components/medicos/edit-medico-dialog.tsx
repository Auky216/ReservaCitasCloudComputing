// components/medicos/edit-medico-dialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MedicoForm } from "./medico-form";

interface EditMedicoDialogProps {
  children: React.ReactNode;
  medico: {
    id: string;
    name: string;
    specialty: string;
    email: string;
    phone: string;
    status: string;
  };
}

export function EditMedicoDialog({ children, medico }: EditMedicoDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (data: any) => {
    console.log("Médico actualizado:", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar médico</DialogTitle>
          <DialogDescription>
            Actualice la información del médico en el sistema.
          </DialogDescription>
        </DialogHeader>
        <MedicoForm onSubmit={handleSubmit} defaultValues={medico} />
      </DialogContent>
    </Dialog>
  );
}