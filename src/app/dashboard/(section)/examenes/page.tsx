"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, User, FileText } from "lucide-react";

// Interfaz para consulta de médico
interface ConsultaMedico {
  descripcion: string;
  fecha: string;
  paciente_id: number;
  paciente_nombre?: string;
  nombre_medico?: string;
}

// Interfaz para consulta de paciente
interface ConsultaPaciente {
  descripcion: string;
  fecha: string;
  nombre_medico: string;
  paciente_id: number;
}

// Interfaz para el resumen de médico
interface ResumenMedico {
  medico?: {
    id: number;
    nombre: string;
    apellido?: string;
    especialidad: string;
  };
  consultas: ConsultaMedico[];
}

// Interfaz para el resumen de paciente
interface ResumenPaciente {
  paciente?: {
    id: number;
    nombre: string;
    dni: string;
    fecha_nac: string;
    sexo: string;
  };
  consultas: ConsultaPaciente[];
  contactos?: any[];
}

// Tipo de búsqueda
type TipoBusqueda = 'medico' | 'paciente';

// Tipo union para resumen
type Resumen = ResumenMedico | ResumenPaciente;

// Tipo union para consultas
type Consulta = ConsultaMedico | ConsultaPaciente;

// URL base de la API
const API_URL = "http://p1-77815598.us-east-1.elb.amazonaws.com:5002";

// Función para formatear fecha
const formatearFecha = (fechaISO: string): string => {
  return new Date(fechaISO).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Función para obtener resumen
async function obtenerResumen(
  tipo: TipoBusqueda, 
  id: number
): Promise<Resumen | null> {
  try {
    const response = await fetch(`${API_URL}/resumen/${tipo}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener resumen de ${tipo} (${response.status})`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en obtenerResumen de ${tipo}:`, error);
    return null;
  }
}

export default function ResumenPage() {
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>('medico');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    setLoading(true);
    setResumen(null);
    setError(null);

    try {
      const resultado = await obtenerResumen(tipoBusqueda, Number(searchId));
      if (resultado) {
        setResumen(resultado);
      } else {
        setError(`No se encontró el ${tipoBusqueda} con el ID proporcionado`);
      }
    } catch (error) {
      console.error("Error en búsqueda", error);
      setError(`Ocurrió un error al buscar el ${tipoBusqueda}`);
    } finally {
      setLoading(false);
    }
  };

  // Manejar paginación de consultas
  const [paginaActual, setPaginaActual] = useState(0);
  const TAMANIO_PAGINA = 5;

  const consultas = resumen ? resumen.consultas : [];
  const consultasPaginadas = consultas.slice(
    paginaActual * TAMANIO_PAGINA,
    (paginaActual + 1) * TAMANIO_PAGINA
  );

  const totalPaginas = Math.ceil(consultas.length / TAMANIO_PAGINA);

  // Función para obtener etiqueta de persona en la tabla de consultas
  const obtenerEtiquetaPersona = (consulta: Consulta, tipo: TipoBusqueda) => {
    if (tipo === 'medico') {
      // Para resumen de médico, usa paciente_nombre si existe
      const consultaMedico = consulta as ConsultaMedico;
      return consultaMedico.paciente_nombre 
        ? `${consultaMedico.paciente_nombre} (ID: ${consultaMedico.paciente_id})`
        : `ID: ${consultaMedico.paciente_id}`;
    } else {
      // Para resumen de paciente, usa nombre_medico
      const consultaPaciente = consulta as ConsultaPaciente;
      return consultaPaciente.nombre_medico;
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 p-4">
      <div className="flex items-center gap-2">
        {tipoBusqueda === 'medico' ? <Users className="w-6 h-6 text-primary" /> : <FileText className="w-6 h-6 text-primary" />}
        <h1 className="text-2xl font-bold">
          Resumen de {tipoBusqueda === 'medico' ? 'Médico' : 'Paciente'}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Busca el resumen de un {tipoBusqueda === 'medico' ? 'médico' : 'paciente'} por su ID.
      </p>

      <div className="flex gap-2 items-center">
        {/* Selector de tipo de búsqueda */}
        <div className="flex gap-2 mr-4">
          <Button 
            variant={tipoBusqueda === 'medico' ? 'default' : 'outline'}
            onClick={() => setTipoBusqueda('medico')}
          >
            Médico
          </Button>
          <Button 
            variant={tipoBusqueda === 'paciente' ? 'default' : 'outline'}
            onClick={() => setTipoBusqueda('paciente')}
          >
            Paciente
          </Button>
        </div>

        <Input
          placeholder={`Buscar ${tipoBusqueda === 'medico' ? 'médico' : 'paciente'} por ID`}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleSearch} variant="secondary">
          <Search className="w-4 h-4 mr-2" /> Buscar
        </Button>
      </div>

      {/* Manejo de errores */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      ) : resumen && (
        <div className="mt-6 space-y-6">
          {/* Tarjeta de Información */}
          <div className="bg-background border rounded-lg p-6 flex items-center gap-6">
            {/* Imagen de usuario por defecto */}
            <div className="bg-gray-200 rounded-full p-4">
              <User className="w-24 h-24 text-gray-500" />
            </div>
            
            {/* Detalles */}
            <div>
              {tipoBusqueda === 'medico' ? (
                // Información de Médico
                <MedicoInfo 
                  medico={(resumen as ResumenMedico).medico} 
                />
              ) : (
                // Información de Paciente
                <PacienteInfo 
                  paciente={(resumen as ResumenPaciente).paciente} 
                />
              )}
            </div>
          </div>

          {/* Tabla de Consultas */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Historial de Consultas</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Fecha</th>
                    {tipoBusqueda === 'medico' ? (
                      <th className="p-3 text-left">Paciente</th>
                    ) : (
                      <th className="p-3 text-left">Médico</th>
                    )}
                    <th className="p-3 text-left">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {consultasPaginadas.map((consulta, index) => (
                    <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="p-3">{formatearFecha(consulta.fecha)}</td>
                      <td className="p-3">
                        {obtenerEtiquetaPersona(consulta, tipoBusqueda)}
                      </td>
                      <td className="p-3">{consulta.descripcion}</td>
                    </tr>
                  ))}
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
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para información de Médico
function MedicoInfo({ medico }: { medico?: ResumenMedico['medico'] }) {
  if (!medico) return null;

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">
        {medico.nombre} {medico.apellido || ''}
      </h2>
      <div className="space-y-2">
        <p className="text-lg">
          <span className="text-muted-foreground">ID:</span> {medico.id}
        </p>
        <p className="text-lg">
          <span className="text-muted-foreground">Especialidad:</span> {medico.especialidad}
        </p>
      </div>
    </>
  );
}

// Componente para información de Paciente
function PacienteInfo({ paciente }: { paciente?: ResumenPaciente['paciente'] }) {
  if (!paciente) return null;

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">
        {paciente.nombre}
      </h2>
      <div className="space-y-2">
        <p className="text-lg">
          <span className="text-muted-foreground">ID:</span> {paciente.id}
        </p>
        <p className="text-lg">
          <span className="text-muted-foreground">DNI:</span> {paciente.dni}
        </p>
        <p className="text-lg">
          <span className="text-muted-foreground">Fecha Nacimiento:</span> {formatearFecha(paciente.fecha_nac)}
        </p>
        <p className="text-lg">
          <span className="text-muted-foreground">Sexo:</span> {paciente.sexo}
        </p>
      </div>
    </>
  );
}