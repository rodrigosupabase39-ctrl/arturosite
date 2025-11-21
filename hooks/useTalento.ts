import { useQuery } from '@tanstack/react-query';
import { TalentoItem } from '@/app/api/talentos/list/route';

async function fetchTalento(tipo: string, id: string): Promise<TalentoItem> {
  const response = await fetch(`/api/talentos/${tipo}/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al obtener talento');
  }

  return response.json();
}

export function useTalento(tipo: 'actores' | 'actrices' | 'guionistas' | 'directores' | null, id: string | null) {
  return useQuery<TalentoItem, Error>({
    queryKey: ['talento', tipo, id],
    queryFn: () => fetchTalento(tipo!, id!),
    enabled: !!tipo && !!id,
    staleTime: 60000, // 1 minuto
  });
}

