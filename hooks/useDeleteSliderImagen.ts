import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

async function deleteSliderImagen(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/slider?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al eliminar imagen del slider');
  }

  return response.json();
}

export function useDeleteSliderImagen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSliderImagen,
    onSuccess: () => {
      toast.success('Imagen del slider eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['slider-imagenes'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar imagen del slider');
    },
  });
}

