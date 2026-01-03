import { z } from 'zod';

export const bloqueTalentoSchema = z.object({
  tipo: z.enum([
    'television',
    'teatro',
    'cine',
    'publicidades',
    'formacion',
    'instagram',
    'premios',
    'idiomas',
    'web-oficial',
    'facebook',
    'experiencia',
  ]),
  contenido: z.string().min(1, 'El contenido es requerido'),
  order: z.number().optional().default(0), // Orden del bloque
});

export const altaTalentoSchema = z.object({
  tipo: z.enum(['actores', 'actrices', 'guionistas', 'directores', 'talentos-sub-18'], {
    message: 'Debes seleccionar un tipo de talento',
  }),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  imagenes: z.array(z.any())
    .refine(
      (files) => {
        // Si no hay archivos, es válido (en modo edición puede no haber nuevas imágenes)
        if (!files || files.length === 0) return true;
        // Si hay archivos, todos deben ser Files válidos
        return files.every((file) => file instanceof File);
      },
      { message: 'Todos los archivos deben ser imágenes válidas' }
    )
    .refine(
      (files) => {
        // Si no hay archivos, es válido
        if (!files || files.length === 0) return true;
        
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        
        return files.every((file: File) => {
          if (!(file instanceof File)) return false;
          
          const fileType = (file.type || '').toLowerCase();
          const fileName = file.name.toLowerCase();
          
          // Verificar por tipo MIME
          const isValidType = fileType && allowedTypes.includes(fileType);
          
          // Verificar por extensión como respaldo (más importante si no hay tipo MIME)
          const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
          
          // Si tiene extensión válida, es válido (incluso sin tipo MIME)
          return isValidType || isValidExtension;
        });
      },
      { message: 'Las imágenes deben ser en formato PNG, JPG, JPEG, WEBP o GIF' }
    ),
  videoUrl: z.string().optional().refine(
    (val) => !val || val === '' || z.string().url().safeParse(val).success,
    { message: 'URL inválida' }
  ),
  bloques: z.array(bloqueTalentoSchema).default([]),
  imagenPrincipal: z.number().optional().default(0), // Índice de la imagen principal
  imagenPortada: z.number().optional(), // Índice de la imagen de portada (opcional)
});

export type BloqueTalento = z.infer<typeof bloqueTalentoSchema>;
export type AltaTalentoFormData = z.infer<typeof altaTalentoSchema>;

