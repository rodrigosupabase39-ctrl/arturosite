import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ReorderRequest {
  tipo: 'actores' | 'actrices' | 'guionistas' | 'directores';
  items: Array<{ id: string; orden: number }>;
}

async function reorderTalentos(request: ReorderRequest): Promise<{ message: string }> {
  const response = await fetch('/api/talentos/reorder', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al actualizar el orden');
  }

  return response.json();
}

export function useReorderTalentos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderTalentos,
    onSuccess: (_, variables) => {
      // Invalidar la query de la lista para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['talentos-list', variables.tipo] });
      toast.success('Orden actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el orden');
    },
  });
}

