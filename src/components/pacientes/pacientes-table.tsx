// components/pacientes/pacientes-table.tsx
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
import { Paciente, getPacientes, PaginationParams, PaginatedResponse } from "@/lib/api/pacientes";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Mars, 
  Venus, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Loader2,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/lib/hooks/use-debounce";
// Interface para las props
interface PacientesTableProps {
  // Props opcionales
}

export function PacientesTable({}: PacientesTableProps = {}) {
  // Estado para los datos y paginación
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Estados para la paginación
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
    sortBy: "nombre",
    sortOrder: "asc"
  });
  
  const [meta, setMeta] = useState({
    total: 0,
    totalPages: 0
  });

  // Cargar datos con paginación
  useEffect(() => {
    const fetchPacientes = async () => {
      setLoading(true);
      try {
        const result = await getPacientes({
          ...pagination,
          search: debouncedSearchTerm
        });
        
        setPacientes(result.data);
        setMeta({
          total: result.meta.total,
          totalPages: result.meta.totalPages
        });
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchPacientes();
  }, [pagination, debouncedSearchTerm]);

  // Cambiar de página
  const changePage = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Cambiar tamaño de página
  const changePageSize = (newSize: number) => {
    setPagination(prev => ({
      ...prev,
      page: 1, // Resetear a primera página
      pageSize: newSize
    }));
  };

  // Cambiar ordenamiento
  const changeSort = (field: string) => {
    setPagination(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Función para calcular la edad a partir de fecha_nac
  const calcularEdad = (fechaNac: string): number => {
    const hoy = new Date();
    const fechaNacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  };

  // Renderizar esqueleto para carga inicial
  if (initialLoading) {
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

  // Calcular rango actual de registros mostrados
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, meta.total);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Barra de búsqueda y filtros */}
        <div className="p-4 border-b flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center flex-1 min-w-[200px]">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o DNI..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={pagination.pageSize.toString()} 
              onValueChange={(value) => changePageSize(parseInt(value))}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filas por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="25">25 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tabla de datos */}
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => changeSort('nombre')}
                >
                  <div className="flex items-center">
                    Nombre
                    {pagination.sortBy === 'nombre' && (
                      <span className="ml-2">
                        {pagination.sortOrder === 'asc' ? 
                          <SortAsc className="w-4 h-4" /> : 
                          <SortDesc className="w-4 h-4" />
                        }
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => changeSort('dni')}
                >
                  <div className="flex items-center">
                    DNI
                    {pagination.sortBy === 'dni' && (
                      <span className="ml-2">
                        {pagination.sortOrder === 'asc' ? 
                          <SortAsc className="w-4 h-4" /> : 
                          <SortDesc className="w-4 h-4" />
                        }
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => changeSort('fecha_nac')}
                >
                  <div className="flex items-center">
                    Fecha Nacimiento
                    {pagination.sortBy === 'fecha_nac' && (
                      <span className="ml-2">
                        {pagination.sortOrder === 'asc' ? 
                          <SortAsc className="w-4 h-4" /> : 
                          <SortDesc className="w-4 h-4" />
                        }
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => changeSort('sexo')}
                >
                  <div className="flex items-center">
                    Sexo
                    {pagination.sortBy === 'sexo' && (
                      <span className="ml-2">
                        {pagination.sortOrder === 'asc' ? 
                          <SortAsc className="w-4 h-4" /> : 
                          <SortDesc className="w-4 h-4" />
                        }
                      </span>
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Filas de carga para cuando se cambia de página
                Array.from({ length: pagination.pageSize }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-[120px] mb-2" />
                          <Skeleton className="h-3 w-[80px]" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                  </TableRow>
                ))
              ) : pacientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {searchTerm ? "No se encontraron pacientes con esa búsqueda." : "No hay pacientes registrados."}
                  </TableCell>
                </TableRow>
              ) : (
                pacientes.map((paciente) => {
                  const edad = calcularEdad(paciente.fecha_nac);
                  return (
                    <TableRow key={paciente.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/10">
                            <AvatarFallback className="bg-primary/5 text-primary">
                              {paciente.nombre.charAt(0)}
                            </AvatarFallback>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${paciente.nombre}&backgroundColor=${paciente.sexo === 'F' ? 'ff77a8' : '4f46e5'}`} />
                          </Avatar>
                          <div>
                            <div className="font-semibold">{paciente.nombre}</div>
                            <div className="text-sm text-muted-foreground">ID: {paciente.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{paciente.dni}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{paciente.fecha_nac} ({edad} años)</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={paciente.sexo === "F" ? "default" : "secondary"} className={`${paciente.sexo === "F" ? "bg-pink-100 text-pink-800 hover:bg-pink-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"}`}>
                          {paciente.sexo === "F" ? (
                            <Venus className="h-3 w-3 mr-1" />
                          ) : (
                            <Mars className="h-3 w-3 mr-1" />
                          )}
                          {paciente.sexo === "F" ? "Femenino" : "Masculino"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Controles de paginación */}
        <div className="p-4 border-t flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-muted-foreground">
            {meta.total > 0 ? (
              <>Mostrando {startItem}-{endItem} de {meta.total} pacientes</>
            ) : (
              <>No hay resultados</>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changePage(1)}
              disabled={pagination.page === 1 || loading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm font-medium mx-2">
              Página {pagination.page} de {meta.totalPages || 1}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page === meta.totalPages || loading || meta.totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => changePage(meta.totalPages)}
              disabled={pagination.page === meta.totalPages || loading || meta.totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
            
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}