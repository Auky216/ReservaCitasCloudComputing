// components/medicos/add-medico-dialog.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MedicoForm } from "./medico-form";
import { createMedico } from "@/lib/api/medicos";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface AddMedicoDialogProps {
  children: React.ReactNode;
  onUpdate: () => Promise<void>;
}

export function AddMedicoDialog({ children, onUpdate }: AddMedicoDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createMedico(data);
      toast.success("Médico agregado", {
        description: `${data.nombre} ${data.apellido} ha sido agregado correctamente.`
      });
      await onUpdate();
      setOpen(false);
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al agregar el médico."
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
              <DialogTitle>Agregar nuevo médico</DialogTitle>
              <DialogDescription>
                Complete el formulario para agregar un nuevo médico al sistema.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <MedicoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}