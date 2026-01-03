import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

async function deleteContacto(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/contactos?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al eliminar contacto');
  }

  return response.json();
}

export function useDeleteContacto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContacto,
    onSuccess: () => {
      // Invalidar la query de contactos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['contactos'] });
      toast.success('Contacto eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar contacto');
    },
  });
}


