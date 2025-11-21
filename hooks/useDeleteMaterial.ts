import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

async function deleteMaterial(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/material?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al eliminar material');
  }

  return response.json();
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      // Invalidar la query de materiales para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['material'] });
      toast.success('Material eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar material');
    },
  });
}

