import { z } from 'zod';

export const contactoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

export type ContactoFormData = z.infer<typeof contactoSchema>;

