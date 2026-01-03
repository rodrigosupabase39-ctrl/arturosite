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

const validTables = ['actores', 'actrices', 'guionistas', 'directores', 'talentos-sub-18'];

// Mapeo de tipos de URL a nombres de tabla en la base de datos
const tableNameMap: Record<string, string> = {
  'actores': 'actores',
  'actrices': 'actrices',
  'guionistas': 'guionistas',
  'directores': 'directores',
  'talentos-sub-18': 'talentos_sub_18',
};

export async function GET(request: NextRequest): Promise<NextResponse<TalentosListResponse | ApiError>> {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    console.log('[TALENTOS LIST] Request recibido:', { tipo, url: request.url });

    if (!tipo || !validTables.includes(tipo)) {
      console.error('[TALENTOS LIST] Tipo inválido:', { tipo, validTables });
      return NextResponse.json<ApiError>(
        { error: 'Tipo de talento inválido. Debe ser: actores, actrices, guionistas, directores o talentos-sub-18' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const tableName = tableNameMap[tipo] || tipo;

    console.log('[TALENTOS LIST] Consultando tabla:', { tipo, tableName });

    // Obtener todos los talentos de la tabla correspondiente, ordenados por 'orden' y luego por fecha de creación
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .order('orden', { ascending: true })
      .order('created_at', { ascending: true });

    console.log('[TALENTOS LIST] Resultado de la consulta:', { 
      tableName, 
      hasData: !!data, 
      dataLength: data?.length || 0,
      count,
      error: error ? { message: error.message, code: error.code, details: error.details } : null
    });

    if (error) {
      console.error('[TALENTOS LIST] Error al obtener lista de talentos:', {
        tableName,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      });
      return NextResponse.json<ApiError>(
        { error: 'Error al obtener lista de talentos', details: error.message },
        { status: 500 }
      );
    }

    console.log('[TALENTOS LIST] Éxito:', { tableName, cantidad: data?.length || 0 });

    return NextResponse.json<TalentosListResponse>({
      talentos: data || [],
    });
  } catch (error: unknown) {
    console.error('[TALENTOS LIST] Error en el servidor:', {
      error,
      stack: error && typeof error === 'object' && 'stack' in error ? String(error.stack) : undefined
    });
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Error desconocido';
    return NextResponse.json<ApiError>(
      { error: 'Error en el servidor', details: errorMessage },
      { status: 500 }
    );
  }
}

