import { useMutation } from '@tanstack/react-query';
import { EnviaMaterialFormData } from '@/schemas/enviaMaterialSchema';
import { EnviaMaterialResponse } from '@/types/api';

async function sendEnviaMaterial(data: EnviaMaterialFormData & { cvPdfFile?: File }): Promise<EnviaMaterialResponse> {
  const formData = new FormData();

  // Agregar todos los campos del formulario como strings
  // Incluir todos los campos, incluso si están vacíos, para que el backend los maneje correctamente
  Object.keys(data).forEach((key) => {
    if (key !== 'cvPdf' && key !== 'cvPdfFile') {
      const value = data[key as keyof EnviaMaterialFormData];
      // Enviar todos los valores, incluso strings vacíos, para que el backend los convierta a null si es necesario
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
      // Si el valor es undefined o null, no se envía (es correcto para campos no tocados)
    }
  });

  // Si hay un archivo PDF, agregarlo
  if (data.cvPdfFile && data.cvPdfFile instanceof File) {
    formData.append('cvPdf', data.cvPdfFile);
  }

  const response = await fetch('/api/envia-material', {
    method: 'POST',
    body: formData, // No establecer Content-Type, el navegador lo hace automáticamente con FormData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'Error al enviar el formulario');
  }

  return response.json();
}

export function useEnviaMaterial() {
  return useMutation({
    mutationFn: sendEnviaMaterial,
  });
}

