import { useQuery } from '@tanstack/react-query';
import { TalentosStatsResponse } from '@/app/api/talentos/stats/route';

async function fetchTalentosStats(): Promise<TalentosStatsResponse> {
  const response = await fetch('/api/talentos/stats');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al obtener estadísticas');
  }

  return response.json();
}

export function useTalentosStats() {
  return useQuery({
    queryKey: ['talentos-stats'],
    queryFn: fetchTalentosStats,
    staleTime: 30000, // 30 segundos - las estadísticas pueden refrescarse cada 30 segundos
  });
}

