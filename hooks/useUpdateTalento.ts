import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AltaTalentoFormData } from '@/schemas/altaTalentoSchema';
import { AltaTalentoResponse } from '@/types/api';

async function updateTalento(
  tipo: string,
  id: string,
  data: AltaTalentoFormData & { imagenes: File[] }
): Promise<AltaTalentoResponse> {
  const formData = new FormData();

  // Agregar campos del formulario
  formData.append('tipo', tipo);
  formData.append('nombre', data.nombre);
  formData.append('videoUrl', data.videoUrl || '');
  formData.append('imagenPrincipal', String(data.imagenPrincipal || 0));
  formData.append('bloques', JSON.stringify(data.bloques || []));

  // Agregar imágenes existentes si existen (modo edición)
  if ((data as any).existingImages && Array.isArray((data as any).existingImages)) {
    formData.append('existingImages', JSON.stringify((data as any).existingImages));
  }

  // Agregar todas las imágenes nuevas
  if (data.imagenes && data.imagenes.length > 0) {
    data.imagenes.forEach((imagen) => {
      formData.append('imagenes', imagen);
    });
  }

  const response = await fetch(`/api/talentos/${tipo}/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al actualizar el talento');
  }

  return response.json();
}

export function useUpdateTalento(tipo: 'actores' | 'actrices' | 'guionistas' | 'directores', id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AltaTalentoFormData & { imagenes: File[] }) => updateTalento(tipo, id, data),
    onSuccess: () => {
      // Invalidar las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['talentos-list', tipo] });
      queryClient.invalidateQueries({ queryKey: ['talento', tipo, id] });
      queryClient.invalidateQueries({ queryKey: ['talentos-stats'] });
    },
  });
}

