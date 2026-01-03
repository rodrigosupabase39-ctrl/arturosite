import { z } from 'zod';

export const enviaMaterialSchema = z.object({
  // Información personal
  nombreCompleto: z.string().min(2, 'El nombre es requerido'),
  apellido: z.string().min(2, 'El apellido es requerido'),
  edad: z.string().min(1, 'La edad es requerida'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  nombreArtistico: z.string().optional(),
  nombreAdultoResponsable: z.string().optional(),
  
  // Contacto
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(1, 'WhatsApp es requerido'),
  tikTok: z.string().optional(),
  instagram: z.string().optional(),
  
  // Documentación
  nacionalidad: z.string().min(1, 'La nacionalidad es requerida'),
  residenciaActual: z.string().optional(),
  pasaporte: z.string().optional(),
  dni: z.string().optional(),
  licenciaConducir: z.string().optional(),
  
  // Características físicas
  altura: z.string().optional(),
  peso: z.string().optional(),
  contextura: z.string().optional(),
  colorPelo: z.string().optional(),
  colorOjos: z.string().optional(),
  talleRemera: z.string().optional(),
  pantalon: z.string().optional(),
  calzado: z.string().optional(),
  
  // Información médica
  tatuajes: z.string().optional(),
  cicatrices: z.string().optional(),
  alergias: z.string().optional(),
  
  // Estilo de vida
  alimentacion: z.string().optional(),
  alimentacionOtros: z.string().optional(),
  hijos: z.string().optional(),
  obraSocial: z.string().optional(),
  contactoEmergencia: z.string().optional(),
  
  // Habilidades
  instrumentos: z.string().optional(),
  canta: z.string().optional(),
  idiomas: z.string().optional(),
  acentoNeutro: z.string().optional(),
  deportes: z.string().optional(),
  baila: z.string().optional(),
  otrasHabilidades: z.string().optional(),
  
  // Material
  reelUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  cvPdf: z.string().optional(), // URL del PDF después de subirse (no se usa en el formulario, solo en la respuesta)
  imagenes: z.array(z.any()).optional(), // Array de archivos de imagen
}).refine(
  (data) => {
    const edad = parseInt(data.edad || '0');
    if (edad < 18) {
      return !!data.nombreAdultoResponsable;
    }
    return true;
  },
  {
    message: 'El nombre del adulto responsable es requerido para menores de edad',
    path: ['nombreAdultoResponsable'],
  }
);

export type EnviaMaterialFormData = z.infer<typeof enviaMaterialSchema>;

