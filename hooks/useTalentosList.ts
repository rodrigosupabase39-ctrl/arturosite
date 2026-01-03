import { useQuery } from '@tanstack/react-query';
import { TalentosListResponse, TalentoItem } from '@/app/api/talentos/list/route';

async function fetchTalentosList(tipo: string): Promise<TalentosListResponse> {
  const url = `/api/talentos/list?tipo=${encodeURIComponent(tipo)}`;
  console.log('[useTalentosList] Fetching:', { tipo, url });

  try {
    const response = await fetch(url);

    console.log('[useTalentosList] Response:', { 
      tipo, 
      status: response.status, 
      ok: response.ok,
      statusText: response.statusText 
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[useTalentosList] Error response:', { tipo, error });
      throw new Error(error.error || error.details || 'Error al obtener lista de talentos');
    }

    const data = await response.json();
    console.log('[useTalentosList] Success:', { tipo, cantidad: data.talentos?.length || 0 });
    return data;
  } catch (error) {
    console.error('[useTalentosList] Exception:', { tipo, error });
    throw error;
  }
}

export function useTalentosList(tipo: 'actores' | 'actrices' | 'guionistas' | 'directores' | 'talentos-sub-18' | null) {
  return useQuery<TalentosListResponse, Error>({
    queryKey: ['talentos-list', tipo],
    queryFn: () => fetchTalentosList(tipo!),
    enabled: !!tipo, // Solo ejecutar la query si hay un tipo seleccionado
    staleTime: 60000, // 1 minuto
  });
}

export type { TalentoItem };

