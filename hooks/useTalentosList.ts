import { useQuery } from '@tanstack/react-query';
import { TalentosListResponse, TalentoItem } from '@/app/api/talentos/list/route';

async function fetchTalentosList(tipo: string): Promise<TalentosListResponse> {
  const response = await fetch(`/api/talentos/list?tipo=${encodeURIComponent(tipo)}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al obtener lista de talentos');
  }

  return response.json();
}

export function useTalentosList(tipo: 'actores' | 'actrices' | 'guionistas' | 'directores' | null) {
  return useQuery<TalentosListResponse, Error>({
    queryKey: ['talentos-list', tipo],
    queryFn: () => fetchTalentosList(tipo!),
    enabled: !!tipo, // Solo ejecutar la query si hay un tipo seleccionado
    staleTime: 60000, // 1 minuto
  });
}

export type { TalentoItem };

