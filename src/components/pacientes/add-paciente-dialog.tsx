"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PacienteForm } from "./paciente-form";
import { createPaciente } from "@/lib/api/pacientes";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface AddPacienteDialogProps {
  children: React.ReactNode;
  onUpdate: () => Promise<void>;
}

export function AddPacienteDialog({ children, onUpdate }: AddPacienteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createPaciente(data);
      toast.success("Paciente agregado", {
        description: `${data.nombre} ha sido agregado correctamente.`
      });
      await onUpdate();
      setOpen(false);
    } catch (error) {
      console.error("Error al agregar paciente:", error);
      toast.error("Error", {
        description: "Ocurrió un error al agregar el paciente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Agregar nuevo paciente</DialogTitle>
              <DialogDescription>
                Complete el formulario para agregar un nuevo paciente al sistema.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <PacienteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}