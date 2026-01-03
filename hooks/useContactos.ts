import { useQuery } from '@tanstack/react-query';
import { ContactosListResponse, ContactoItem } from '@/app/api/contactos/route';

async function fetchContactos(): Promise<ContactosListResponse> {
  const response = await fetch('/api/contactos');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al obtener contactos');
  }

  return response.json();
}

export function useContactos() {
  return useQuery<ContactosListResponse, Error>({
    queryKey: ['contactos'],
    queryFn: fetchContactos,
    staleTime: 60000, // 1 minuto
  });
}

export type { ContactoItem };


