// components/pacientes/paciente-form.tsx
"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Paciente } from "@/lib/api/pacientes";
import { Mars, Venus } from "lucide-react";

// Definir esquema de validación
const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  dni: z.string().min(8, { message: "El DNI debe tener al menos 8 caracteres" }),
  fecha_nac: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de fecha inválido (YYYY-MM-DD)" }),
  sexo: z.string().min(1, { message: "Debe seleccionar un sexo" }),
});

interface PacienteFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isSubmitting?: boolean;
}

export function PacienteForm({ onSubmit, isSubmitting = false }: PacienteFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      dni: "",
      fecha_nac: "",
      sexo: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="María" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input placeholder="12345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_nac"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} onChange={(e) => {
                    // Formatea la fecha al formato YYYY-MM-DD que espera la API
                    field.onChange(e.target.value);
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sexo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="F" className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Venus className="h-4 w-4 text-pink-500" />
                        <span>Femenino</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="M" className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Mars className="h-4 w-4 text-blue-500" />
                        <span>Masculino</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Guardando..." : "Guardar paciente"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}