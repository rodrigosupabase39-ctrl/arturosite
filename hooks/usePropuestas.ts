import { useQuery } from '@tanstack/react-query';
import { PropuestasListResponse, PropuestaItem } from '@/app/api/propuestas/route';

async function fetchPropuestas(): Promise<PropuestasListResponse> {
  const response = await fetch('/api/propuestas');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al obtener propuestas');
  }

  return response.json();
}

export function usePropuestas() {
  return useQuery<PropuestasListResponse, Error>({
    queryKey: ['propuestas'],
    queryFn: fetchPropuestas,
    staleTime: 60000, // 1 minuto
  });
}

export type { PropuestaItem };

