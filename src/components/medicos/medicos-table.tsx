// src/components/medicos/medicos-table.tsx
"use client";

import React, { useEffect, useState } from "react";
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
import { Medico, getMedicos } from "@/lib/api/medicos";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  HeartPulse, 
  Brain, 
  Baby, 
  Stethoscope, 
  Bone, 
  Eye, 
  User2
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Mapa de iconos por especialidad
const especialidadIconMap: Record<string, React.ReactNode> = {
  "Cardiología": <HeartPulse className="h-4 w-4 text-red-500" />,
  "Neurología": <Brain className="h-4 w-4 text-blue-500" />,
  "Pediatría": <Baby className="h-4 w-4 text-green-500" />,
  "Traumatología": <Bone className="h-4 w-4 text-amber-500" />,
  "Oftalmología": <Eye className="h-4 w-4 text-purple-500" />,
  "Dermatología": <User2 className="h-4 w-4 text-pink-500" />,
  // Icono por defecto para otras especialidades
  "default": <Stethoscope className="h-4 w-4 text-gray-500" />
};

// Si necesitas props en el futuro, puedes definirlas así
interface MedicosTableProps {
  // Props opcionales que puedas necesitar en el futuro
}

export function MedicosTable({}: MedicosTableProps = {}) {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMedicos, setFilteredMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const data = await getMedicos();
        setMedicos(data);
        setFilteredMedicos(data);
      } catch (error) {
        console.error("Error al cargar médicos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicos();
  }, []);

  // Filtrar médicos cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMedicos(medicos);
      return;
    }
    
    const filtered = medicos.filter(
      medico => 
        medico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medico.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medico.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredMedicos(filtered);
  }, [searchTerm, medicos]);

  // Función para obtener el icono según la especialidad
  const getEspecialidadIcon = (especialidad: string) => {
    return especialidadIconMap[especialidad] || especialidadIconMap.default;
  };

  // Estado activo/inactivo (simulado - cada 3er médico inactivo)
  const getMedicoStatus = (id: number = 0) => {
    return id % 3 === 0 ? "Inactivo" : "Activo";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b flex items-center">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, apellido o especialidad..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    {searchTerm ? "No se encontraron médicos con esa búsqueda." : "No hay médicos registrados."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMedicos.map((medico) => {
                  const status = getMedicoStatus(medico.id);
                  return (
                    <TableRow key={medico.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/10">
                            <AvatarFallback className="bg-primary/5 text-primary">
                              {medico.nombre.charAt(0)}{medico.apellido.charAt(0)}
                            </AvatarFallback>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${medico.nombre} ${medico.apellido}&backgroundColor=4f46e5`} />
                          </Avatar>
                          <div>
                            <div className="font-semibold">{medico.nombre} {medico.apellido}</div>
                            <div className="text-sm text-muted-foreground">ID: {medico.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEspecialidadIcon(medico.especialidad)}
                          <span>{medico.especialidad}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status === "Activo" ? "default" : "secondary"} className={`${status === "Activo" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}`}>
                          <span className={`mr-1 h-2 w-2 rounded-full ${status === "Activo" ? "bg-green-400" : "bg-gray-400"}`} />
                          {status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}