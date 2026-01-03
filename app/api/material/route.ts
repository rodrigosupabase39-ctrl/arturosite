import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ApiError } from '@/types/api';

export interface MaterialItem {
  id: string;
  nombre_completo: string;
  apellido: string;
  edad: number;
  fecha_nacimiento: string;
  nombre_artistico: string | null;
  nombre_adulto_responsable: string | null;
  email: string;
  whatsapp: string;
  tik_tok: string | null;
  instagram: string | null;
  nacionalidad: string;
  residencia_actual: string | null;
  pasaporte: string | null;
  dni: string | null;
  licencia_conducir: string | null;
  altura: string | null;
  peso: string | null;
  contextura: string | null;
  color_pelo: string | null;
  color_ojos: string | null;
  talle_remera: string | null;
  pantalon: string | null;
  calzado: string | null;
  tatuajes: string | null;
  cicatrices: string | null;
  alergias: string | null;
  alimentacion: string | null;
  alimentacion_otros: string | null;
  hijos: string | null;
  obra_social: string | null;
  contacto_emergencia: string | null;
  instrumentos: string | null;
  canta: string | null;
  idiomas: string | null;
  acento_neutro: string | null;
  deportes: string | null;
  baila: string | null;
  otras_habilidades: string | null;
  reel_url: string | null;
  cv_pdf_url: string | null;
  imagenes_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface MaterialListResponse {
  materiales: MaterialItem[];
}

export async function GET(request: NextRequest): Promise<NextResponse<MaterialListResponse | ApiError>> {
  try {
    const supabase = createServiceClient();

    // Obtener todos los materiales ordenados por fecha de creación (más recientes primero)
    const { data, error } = await supabase
      .from('envia_material')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener materiales:', error);
      return NextResponse.json<ApiError>(
        { error: 'Error al obtener materiales', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<MaterialListResponse>({
      materiales: data || [],
    });
  } catch (error: unknown) {
    console.error('Error en el servidor:', error);
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Error desconocido';
    return NextResponse.json<ApiError>(
      { error: 'Error en el servidor', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<{ message: string } | ApiError>> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiError>(
        { error: 'ID de material requerido' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Eliminar el material
    const { error: deleteError } = await supabase
      .from('envia_material')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error al eliminar material:', deleteError);
      return NextResponse.json<ApiError>(
        { error: 'Error al eliminar material', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json<{ message: 'Material eliminado exitosamente' }>(
      { message: 'Material eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error en el servidor:', error);
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Error desconocido';
    return NextResponse.json<ApiError>(
      { error: 'Error en el servidor', details: errorMessage },
      { status: 500 }
    );
  }
}

