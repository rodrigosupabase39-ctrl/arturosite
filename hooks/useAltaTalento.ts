import { useMutation } from '@tanstack/react-query';
import { AltaTalentoFormData } from '@/schemas/altaTalentoSchema';
import { AltaTalentoResponse } from '@/types/api';

async function sendAltaTalento(data: AltaTalentoFormData & { imagenes: File[] }): Promise<AltaTalentoResponse> {
  const formData = new FormData();

  // Agregar campos del formulario
  formData.append('tipo', data.tipo);
  formData.append('nombre', data.nombre);
  formData.append('videoUrl', data.videoUrl || '');
  formData.append('imagenPrincipal', String(data.imagenPrincipal || 0));
  if (data.imagenPortada !== undefined) {
    formData.append('imagenPortada', String(data.imagenPortada));
  }
  formData.append('bloques', JSON.stringify(data.bloques || []));

  // Agregar todas las imágenes
  if (data.imagenes && data.imagenes.length > 0) {
    data.imagenes.forEach((imagen) => {
      formData.append('imagenes', imagen);
    });
  }

  const response = await fetch('/api/alta-talento', {
    method: 'POST',
    body: formData, // No establecer Content-Type, el navegador lo hace automáticamente con FormData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al guardar el talento');
  }

  return response.json();
}

export function useAltaTalento() {
  return useMutation({
    mutationFn: sendAltaTalento,
  });
}

