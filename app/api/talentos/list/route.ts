import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ApiError } from '@/types/api';

export interface TalentoItem {
  id: number;
  nombre: string;
  video_url: string | null;
  imagen_principal_url: string | null;
  imagenes_urls: string[];
  bloques: Array<{ tipo: string; contenido: string; order?: number }>;
  imagen_principal_index: number;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface TalentosListResponse {
  talentos: TalentoItem[];
}

const validTables = ['actores', 'actrices', 'guionistas', 'directores'];

export async function GET(request: NextRequest): Promise<NextResponse<TalentosListResponse | ApiError>> {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    if (!tipo || !validTables.includes(tipo)) {
      return NextResponse.json<ApiError>(
        { error: 'Tipo de talento inválido. Debe ser: actores, actrices, guionistas o directores' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Obtener todos los talentos de la tabla correspondiente, ordenados por 'orden' y luego por fecha de creación
    const { data, error } = await supabase
      .from(tipo)
      .select('*')
      .order('orden', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al obtener lista de talentos:', error);
      return NextResponse.json<ApiError>(
        { error: 'Error al obtener lista de talentos', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<TalentosListResponse>({
      talentos: data || [],
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

