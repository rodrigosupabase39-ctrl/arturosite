import { useQuery } from '@tanstack/react-query';
import { SliderListResponse, SliderImagen } from '@/app/api/slider/route';

async function fetchSliderImagenes(): Promise<SliderListResponse> {
  const response = await fetch('/api/slider');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al obtener imágenes del slider');
  }

  return response.json();
}

export function useSliderImagenes() {
  return useQuery<SliderListResponse, Error>({
    queryKey: ['slider-imagenes'],
    queryFn: fetchSliderImagenes,
    staleTime: 30000, // 30 segundos
  });
}

export type { SliderImagen };

