"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { FileText, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Examen, getExamenes, getExamenPorId, actualizarExamen, eliminarExamen, crearExamen } from "@/lib/api/historial";

export default function ExamenesPage() {
  const [todosExamenes, setTodosExamenes] = useState<Examen[]>([]);
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(0);
  const TAMANIO_PAGINA = 10;

  // Estados para diálogos y formularios
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Estado para el examen actual (para agregar/editar)
  const [currentExamen, setCurrentExamen] = useState<Partial<Examen>>({
    pacienteId: "",
    medicoId: "",
    tipoExamen: "",
    estado: "pendiente",
    fecha: new Date().toISOString(),
    resultado: {}
  });
  
  // ID del examen seleccionado
  const [selectedExamenId, setSelectedExamenId] = useState<string | null>(null);

  // Cargar exámenes
  useEffect(() => {
    const cargarExamenes = async () => {
      try {
        const data = await getExamenes(1000); // Cargar muchos exámenes inicialmente
        setTodosExamenes(data);
      } catch (error) {
        console.error("Error al cargar exámenes", error);
      } finally {
        setLoading(false);
      }
    };

    cargarExamenes();
  }, []);

  // Filtrar exámenes cuando cambia el término de búsqueda o los exámenes totales
  useEffect(() => {
    // Filtrar exámenes
    const filtered = todosExamenes.filter(examen => 
      examen.pacienteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      examen.medicoId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      examen.tipoExamen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      examen.estado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Establecer exámenes con paginación
    setExamenes(filtered);
    setPaginaActual(0); // Resetear a primera página al filtrar
  }, [searchTerm, todosExamenes]);

  // Obtener exámenes paginados
  const examenesPaginados = examenes.slice(
    paginaActual * TAMANIO_PAGINA,
    (paginaActual + 1) * TAMANIO_PAGINA
  );

  // Calcular total de páginas
  const totalPaginas = Math.ceil(examenes.length / TAMANIO_PAGINA);

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentExamen(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Preparar edición de examen
  const prepararEdicion = async (examen: Examen) => {
    try {
      // Obtener detalles completos del examen
      const examenCompleto = await getExamenPorId(examen.id);
      if (examenCompleto) {
        setCurrentExamen(examenCompleto);
        setSelectedExamenId(examen.id);
        setIsEditDialogOpen(true);
      }
    } catch (error) {
      console.error("Error al preparar edición", error);
    }
  };

  // Actualizar examen
  const handleUpdateExamen = async () => {
    if (!selectedExamenId) return;

    try {
      const examenActualizado = await actualizarExamen(selectedExamenId, currentExamen);
      
      if (examenActualizado) {
        // Actualizar lista de exámenes
        setTodosExamenes(prev => 
          prev.map(e => e.id === selectedExamenId ? examenActualizado : e)
        );
        
        // Cerrar diálogo
        setIsEditDialogOpen(false);
        setSelectedExamenId(null);
        setCurrentExamen({});
      }
    } catch (error) {
      console.error("Error al actualizar examen", error);
    }
  };

  // Crear nuevo examen
  const handleCreateExamen = async () => {
    try {
      // Omitir 'id' al crear
      const { id, ...examenData } = currentExamen;
      const nuevoExamen = await crearExamen(examenData as Omit<Examen, 'id'>);
      
      // Actualizar lista de exámenes
      setTodosExamenes(prev => [...prev, nuevoExamen]);
      
      // Cerrar diálogo
      setIsAddDialogOpen(false);
      setCurrentExamen({});
    } catch (error) {
      console.error("Error al crear examen", error);
    }
  };

  // Preparar eliminación
  const prepararEliminacion = (examen: Examen) => {
    setSelectedExamenId(examen.id);
    setIsDeleteDialogOpen(true);
  };

  // Eliminar examen
  const handleDeleteExamen = async () => {
    if (!selectedExamenId) return;

    try {
      const eliminado = await eliminarExamen(selectedExamenId);
      
      if (eliminado) {
        // Actualizar lista de exámenes
        setTodosExamenes(prev => 
          prev.filter(e => e.id !== selectedExamenId)
        );
        
        // Cerrar diálogo
        setIsDeleteDialogOpen(false);
        setSelectedExamenId(null);
      }
    } catch (error) {
      console.error("Error al eliminar examen", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Exámenes</h1>
        </div>
        
        {/* Botón para agregar nuevo examen */}
        <Button onClick={() => {
          setCurrentExamen({
            pacienteId: "",
            medicoId: "",
            tipoExamen: "",
            estado: "pendiente",
            fecha: new Date().toISOString(),
            resultado: {}
          });
          setIsAddDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" /> Nuevo Examen
        </Button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar exámenes por ID, médico, paciente o tipo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Search className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Tabla de Exámenes */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Paciente ID</th>
              <th className="p-3 text-left">Médico ID</th>
              <th className="p-3 text-left">Tipo Examen</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">Cargando...</td>
              </tr>
            ) : examenesPaginados.length > 0 ? (
              examenesPaginados.map((examen) => (
                <tr key={examen.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{examen.id}</td>
                  <td className="p-3">{examen.pacienteId}</td>
                  <td className="p-3">{examen.medicoId}</td>
                  <td className="p-3">{examen.tipoExamen}</td>
                  <td className="p-3">{examen.estado}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => prepararEdicion(examen)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => prepararEliminacion(examen)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4">No se encontraron exámenes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="flex justify-between mt-4">
        <Button 
          onClick={() => setPaginaActual(p => Math.max(0, p - 1))}
          disabled={paginaActual === 0}
          variant="outline"
        >
          Anterior
        </Button>
        <span className="self-center">
          Página {paginaActual + 1} de {totalPaginas}
        </span>
        <Button 
          onClick={() => setPaginaActual(p => 
            p + 1 < totalPaginas ? p + 1 : p
          )}
          disabled={paginaActual >= totalPaginas - 1}
          variant="outline"
        >
          Siguiente
        </Button>
      </div>

      {/* Diálogos de Agregar, Editar y Eliminar (permanecen igual) */}
      {/* ... (diálogos anteriores) ... */}
    </div>
  );
}