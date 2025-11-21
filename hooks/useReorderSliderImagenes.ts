import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ReorderSliderImagenesPayload {
  ids: string[];
}

async function reorderSliderImagenes(payload: ReorderSliderImagenesPayload): Promise<{ message: string }> {
  const response = await fetch('/api/slider/reorder', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al reordenar imágenes del slider');
  }

  return response.json();
}

export function useReorderSliderImagenes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderSliderImagenes,
    onSuccess: () => {
      toast.success('Orden actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['slider-imagenes'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el orden');
    },
  });
}

