// components/medicos/medicos-table.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { MedicoActions } from "./medico-actions";

// Datos de ejemplo
const medicosData = [
  {
    id: "1",
    name: "Dr. Juan Pérez",
    specialty: "Cardiología",
    email: "juan.perez@hospital.com",
    phone: "123-456-7890",
    status: "Activo"
  },
  {
    id: "2",
    name: "Dra. María López",
    specialty: "Neurología",
    email: "maria.lopez@hospital.com",
    phone: "123-456-7891",
    status: "Activo"
  },
  {
    id: "3",
    name: "Dr. Carlos Rodríguez",
    specialty: "Pediatría",
    email: "carlos.rodriguez@hospital.com",
    phone: "123-456-7892",
    status: "Inactivo"
  },
];

export function MedicosTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[80px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicosData.map((medico) => (
            <TableRow key={medico.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{medico.name.substring(0, 2)}</AvatarFallback>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${medico.name}`} />
                  </Avatar>
                  <span>{medico.name}</span>
                </div>
              </TableCell>
              <TableCell>{medico.specialty}</TableCell>
              <TableCell>{medico.email}</TableCell>
              <TableCell>{medico.phone}</TableCell>
              <TableCell>
                <Badge variant={medico.status === "Activo" ? "default" : "secondary"}>
                  {medico.status}
                </Badge>
              </TableCell>
              <TableCell>
                <MedicoActions medico={medico} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}