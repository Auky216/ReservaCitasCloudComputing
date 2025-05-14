import { useState, useEffect } from 'react';
import { Paciente, PaginatedResponse, PaginationParams, getPacientes } from '@/lib/api/pacientes';

// Tipo para el objeto de caché
interface PacientesCache {
  [key: string]: {
    data: Paciente[];
    timestamp: number;
    meta: {
      total: number;
      totalPages: number;
    };
  };
}

// Configuración del caché
const CACHE_LIMIT = 1000; // Máximo de pacientes en caché
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos en milisegundos

// Función para generar una clave única para cada consulta
const getCacheKey = (params: PaginationParams): string => {
  return `page=${params.page}&pageSize=${params.pageSize}&sortBy=${params.sortBy}&sortOrder=${params.sortOrder}&search=${params.search || ''}`;
};

export function usePacientesCache() {
  // Estado para almacenar el caché
  const [cache, setCache] = useState<PacientesCache>({});
  const [totalCachedItems, setTotalCachedItems] = useState<number>(0);
  
  // Limpiar caché cuando alcanza el límite o expira
  const cleanupCache = () => {
    const now = Date.now();
    const newCache: PacientesCache = {};
    let count = 0;
    
    // Ordenar entradas por tiempo, mantener las más recientes
    const entries = Object.entries(cache)
      .filter(([_, value]) => now - value.timestamp < CACHE_EXPIRY)
      .sort((a, b) => b[1].timestamp - a[1].timestamp);
    
    // Reconstruir el caché con las entradas más recientes
    for (const [key, value] of entries) {
      if (count + value.data.length <= CACHE_LIMIT) {
        newCache[key] = value;
        count += value.data.length;
      } else {
        break;
      }
    }
    
    setCache(newCache);
    setTotalCachedItems(count);
  };
  
  // Efecto para limpiar el caché periódicamente
  useEffect(() => {
    const interval = setInterval(cleanupCache, CACHE_EXPIRY / 2);
    return () => clearInterval(interval);
  }, [cache]);
  
  // Función para obtener datos con caché
  const fetchPacientesWithCache = async (params: PaginationParams): Promise<PaginatedResponse<Paciente>> => {
    const cacheKey = getCacheKey(params);
    
    // Comprobar si los datos están en caché y son válidos
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_EXPIRY) {
      console.log('Usando datos en caché para:', cacheKey);
      return {
        data: cache[cacheKey].data,
        meta: cache[cacheKey].meta
      };
    }
    
    // Si no están en caché o expiró, obtener de la API
    console.log('Obteniendo datos frescos para:', cacheKey);
    const response = await getPacientes(params);
    
    // Actualizar el caché
    setCache(prevCache => {
      const newCache = { ...prevCache };
      newCache[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
        meta: response.meta
      };
      return newCache;
    });
    
    // Actualizar contador de elementos en caché
    setTotalCachedItems(prev => prev + response.data.length);
    
    // Limpiar caché si excede el límite
    if (totalCachedItems + response.data.length > CACHE_LIMIT) {
      cleanupCache();
    }
    
    return response;
  };
  
  // Función para invalidar el caché (útil después de crear/actualizar)
  const invalidateCache = () => {
    setCache({});
    setTotalCachedItems(0);
  };
  
  return {
    fetchPacientesWithCache,
    invalidateCache,
    cacheSize: totalCachedItems
  };
}