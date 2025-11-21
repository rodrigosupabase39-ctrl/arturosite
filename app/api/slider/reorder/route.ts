import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ApiError } from '@/types/api';

export async function PUT(request: NextRequest): Promise<NextResponse<{ message: string } | ApiError>> {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json<ApiError>(
        { error: 'Lista de IDs inválida' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Actualizar cada imagen individualmente con solo el campo orden
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      const { error } = await supabase
        .from('slider_imagenes')
        .update({ orden: index })
        .eq('id', id);

      if (error) {
        console.error(`Error al actualizar orden de imagen ${id}:`, error);
        return NextResponse.json<ApiError>(
          { error: 'Error al reordenar imágenes del slider', details: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json<{ message: string }>(
      { message: 'Orden de imágenes actualizado exitosamente' },
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

