import { useMutation, useQueryClient } from '@tanstack/react-query';

async function deleteTalento(tipo: string, id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/talentos/${tipo}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al eliminar el talento');
  }

  return response.json();
}

export function useDeleteTalento(tipo: 'actores' | 'actrices' | 'guionistas' | 'directores') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteTalento(tipo, id),
    onSuccess: () => {
      // Invalidar las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['talentos-list', tipo] });
      queryClient.invalidateQueries({ queryKey: ['talentos-stats'] });
    },
  });
}

