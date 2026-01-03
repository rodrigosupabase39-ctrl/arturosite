import { useQuery } from '@tanstack/react-query';
import { TalentoItem } from '@/app/api/talentos/list/route';

async function fetchTalento(tipo: string, slug: string): Promise<TalentoItem> {
  const url = `/api/talentos/${tipo}/${slug}`;
  console.log('[useTalento] Fetching:', { tipo, slug, url });

  try {
    const response = await fetch(url);

    console.log('[useTalento] Response:', { 
      tipo, 
      slug,
      status: response.status, 
      ok: response.ok,
      statusText: response.statusText 
    });

    if (!response.ok) {
      let errorData: any = null;
      try {
        const text = await response.text();
        if (text) {
          try {
            errorData = JSON.parse(text);
          } catch (e) {
            // Si no es JSON válido, usar el texto como mensaje
            errorData = { error: text, details: text };
          }
        }
      } catch (e) {
        // Si no se puede leer la respuesta
        console.error('[useTalento] Error al leer respuesta:', { tipo, slug, status: response.status, error: e });
      }
      
      const errorMessage = errorData?.error || errorData?.details || `Error ${response.status}: ${response.statusText || 'Error al obtener talento'}`;
      console.error('[useTalento] Error response:', { tipo, slug, status: response.status, errorData, errorMessage });
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('[useTalento] Success:', { tipo, slug, nombre: data.nombre });
    return data;
  } catch (error) {
    console.error('[useTalento] Exception:', { tipo, slug, error });
    throw error;
  }
}

export function useTalento(tipo: 'actores' | 'actrices' | 'guionistas' | 'directores' | 'talentos-sub-18' | null, slug: string | null) {
  return useQuery<TalentoItem, Error>({
    queryKey: ['talento', tipo, slug],
    queryFn: () => fetchTalento(tipo!, slug!),
    enabled: !!tipo && !!slug,
    staleTime: 60000, // 1 minuto
  });
}

