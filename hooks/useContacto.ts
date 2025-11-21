import { useMutation } from '@tanstack/react-query';
import { ContactoFormData } from '@/schemas/contactoSchema';
import { ContactoResponse, ApiError } from '@/types/api';

async function sendContacto(data: ContactoFormData): Promise<ContactoResponse> {
  const response = await fetch('/api/contacto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al enviar el mensaje');
  }

  return response.json();
}

export function useContacto() {
  return useMutation({
    mutationFn: sendContacto,
  });
}

