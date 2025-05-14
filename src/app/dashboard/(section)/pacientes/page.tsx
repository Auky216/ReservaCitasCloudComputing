"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Paciente } from "@/lib/api/pacientes";
import { getPacientes } from "@/lib/api/pacientes";
import { SearchIcon, UsersIcon, VenusIcon, MarsIcon } from "lucide-react";

const PAGE_SIZE = 1000;

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [filteredPaciente, setFilteredPaciente] = useState<Paciente | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [cachedPacientes, setCachedPacientes] = useState<Paciente[] | null>(null);

  useEffect(() => {
    const loadPacientes = async () => {
      setLoading(true);
      try {
        const data = await getPacientes();
        setCachedPacientes(data);
        setPacientes(data);
      } catch (error) {
        console.error("Error al cargar pacientes", error);
      }
      setLoading(false);
    };

    loadPacientes();
  }, []);

  const handleSearch = () => {
    if (!searchId.trim()) return;
    const found = cachedPacientes?.find((p) => p.id === Number(searchId)) || null;
    setFilteredPaciente(found);
  };

  const currentPatients = pacientes.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const renderSexoIcon = (sexo: string) => {
    if (sexo.toLowerCase() === "femenino") {
      return <VenusIcon className="text-pink-500 w-4 h-4" />;
    } else if (sexo.toLowerCase() === "masculino") {
      return <MarsIcon className="text-blue-500 w-4 h-4" />;
    }
    return sexo;
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 p-4">
      <div className="flex items-center gap-2">
        <UsersIcon className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Pacientes</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Aquí puedes ver los pacientes registrados en el sistema.
      </p>

      <div className="flex gap-2 items-center">
        <Input
          placeholder="Buscar paciente por ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleSearch} variant="secondary">
          <SearchIcon className="w-4 h-4 mr-2" /> Buscar
        </Button>
      </div>

      {filteredPaciente && (
        <div className="mt-4">
          <h2 className="font-semibold">Resultado de búsqueda:</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Fecha Nac.</TableHead>
                <TableHead>Sexo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{filteredPaciente.id}</TableCell>
                <TableCell>{filteredPaciente.nombre}</TableCell>
                <TableCell>{filteredPaciente.dni}</TableCell>
                <TableCell>{filteredPaciente.fecha_nac}</TableCell>
                <TableCell>{renderSexoIcon(filteredPaciente.sexo)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        cachedPacientes && !filteredPaciente && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Listado de pacientes (página {currentPage + 1})</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Fecha Nac.</TableHead>
                  <TableHead>Sexo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPatients.map((paciente) => (
                  <TableRow key={paciente.id}>
                    <TableCell>{paciente.id}</TableCell>
                    <TableCell>{paciente.nombre}</TableCell>
                    <TableCell>{paciente.dni}</TableCell>
                    <TableCell>{paciente.fecha_nac}</TableCell>
                    <TableCell>{renderSexoIcon(paciente.sexo)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between mt-4">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((p) =>
                    (p + 1) * PAGE_SIZE < pacientes.length ? p + 1 : p
                  )
                }
                variant="outline"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}