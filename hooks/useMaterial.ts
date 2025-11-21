import { useQuery } from '@tanstack/react-query';
import { MaterialListResponse, MaterialItem } from '@/app/api/material/route';

async function fetchMaterial(): Promise<MaterialListResponse> {
  const response = await fetch('/api/material');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al obtener materiales');
  }

  return response.json();
}

export function useMaterial() {
  return useQuery<MaterialListResponse, Error>({
    queryKey: ['material'],
    queryFn: fetchMaterial,
    staleTime: 60000, // 1 minuto
  });
}

export type { MaterialItem };

