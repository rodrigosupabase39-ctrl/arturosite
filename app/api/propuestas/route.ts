import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ApiError } from '@/types/api';

export interface PropuestaItem {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  mensaje: string;
  created_at: string;
  updated_at: string;
}

export interface PropuestasListResponse {
  propuestas: PropuestaItem[];
}

export async function GET(request: NextRequest): Promise<NextResponse<PropuestasListResponse | ApiError>> {
  try {
    const supabase = createServiceClient();

    // Obtener todas las propuestas ordenadas por fecha de creación (más recientes primero)
    const { data, error } = await supabase
      .from('contactos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener propuestas:', error);
      return NextResponse.json<ApiError>(
        { error: 'Error al obtener propuestas', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<PropuestasListResponse>({
      propuestas: data || [],
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
        { error: 'ID de propuesta requerido' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Eliminar la propuesta
    const { error: deleteError } = await supabase
      .from('contactos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error al eliminar propuesta:', deleteError);
      return NextResponse.json<ApiError>(
        { error: 'Error al eliminar propuesta', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json<{ message: 'Propuesta eliminada exitosamente' }>(
      { message: 'Propuesta eliminada exitosamente' },
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

