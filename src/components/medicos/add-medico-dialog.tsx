"use client";   
// components/medicos/add-medico-dialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MedicoForm } from "./medico-form";

interface AddMedicoDialogProps {
  children: React.ReactNode;
}

export function AddMedicoDialog({ children }: AddMedicoDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (data: any) => {
    console.log("Médico agregado:", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar nuevo médico</DialogTitle>
          <DialogDescription>
            Complete el formulario para agregar un nuevo médico al sistema.
          </DialogDescription>
        </DialogHeader>
        <MedicoForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}