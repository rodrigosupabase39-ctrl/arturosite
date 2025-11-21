import { ContactoFormData } from '@/schemas/contactoSchema';
import { EnviaMaterialFormData } from '@/schemas/enviaMaterialSchema';
import { AltaTalentoFormData } from '@/schemas/altaTalentoSchema';

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  message: string;
  data: T;
}

export interface ApiError {
  error: string;
  details?: string | unknown;
}

// Tipos específicos para cada endpoint
export interface ContactoResponse extends ApiResponse {
  data: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    mensaje: string;
    created_at: string;
    updated_at: string;
  };
}

export interface EnviaMaterialResponse extends ApiResponse {
  data: {
    id: string;
    nombre_completo: string;
    apellido: string;
    email: string;
    cv_pdf_url: string | null;
    reel_url: string | null;
    created_at: string;
    updated_at: string;
    // ... otros campos
    [key: string]: unknown;
  };
}

export interface AltaTalentoResponse extends ApiResponse {
  data: {
    id: string;
    tipo: 'actores' | 'actrices' | 'guionistas' | 'directores';
    nombre: string;
    video_url: string | null;
    imagen_principal_url: string | null;
    imagenes_urls: string[];
    bloques: Array<{ tipo: string; contenido: string }>;
    imagen_principal_index: number;
    created_at: string;
    updated_at: string;
  };
}

// Tipos para requests
export type ContactoRequest = ContactoFormData;
export type EnviaMaterialRequest = EnviaMaterialFormData & { cvPdfFile?: File };
export type AltaTalentoRequest = AltaTalentoFormData & { imagenes?: File[] };

