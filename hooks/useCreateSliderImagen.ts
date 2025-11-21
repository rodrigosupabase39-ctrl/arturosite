import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SliderImagen } from '@/app/api/slider/route';

interface CreateSliderImagenPayload {
  imagen: File;
}

async function createSliderImagen(payload: CreateSliderImagenPayload): Promise<{ message: string; imagen: SliderImagen }> {
  const formData = new FormData();
  formData.append('imagen', payload.imagen);

  const response = await fetch('/api/slider/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al crear imagen del slider');
  }

  return response.json();
}

export function useCreateSliderImagen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSliderImagen,
    onSuccess: () => {
      toast.success('Imagen del slider agregada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['slider-imagenes'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al agregar imagen del slider');
    },
  });
}

