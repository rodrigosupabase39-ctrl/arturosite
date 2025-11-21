import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

async function deletePropuesta(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/propuestas?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al eliminar propuesta');
  }

  return response.json();
}

export function useDeletePropuesta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePropuesta,
    onSuccess: () => {
      // Invalidar la query de propuestas para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['propuestas'] });
      toast.success('Propuesta eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar propuesta');
    },
  });
}

