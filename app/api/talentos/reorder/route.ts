import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ApiError } from '@/types/api';

const validTables = ['actores', 'actrices', 'guionistas', 'directores'];

export interface ReorderRequest {
  tipo: string;
  items: Array<{ id: string; orden: number }>;
}

export async function PUT(request: NextRequest): Promise<NextResponse<{ message: string } | ApiError>> {
  try {
    const body: ReorderRequest = await request.json();
    const { tipo, items } = body;

    if (!tipo || !validTables.includes(tipo)) {
      return NextResponse.json<ApiError>(
        { error: 'Tipo de talento inválido. Debe ser: actores, actrices, guionistas o directores' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json<ApiError>(
        { error: 'Se requiere un array de items con id y orden' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Actualizar el orden de cada item
    const updates = items.map((item) =>
      supabase
        .from(tipo)
        .update({ orden: item.orden })
        .eq('id', item.id)
    );

    const results = await Promise.all(updates);

    // Verificar si hubo errores
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      console.error('Error al actualizar orden:', errors);
      return NextResponse.json<ApiError>(
        { error: 'Error al actualizar el orden de los talentos', details: errors[0].error?.message },
        { status: 500 }
      );
    }

    return NextResponse.json<{ message: 'Orden actualizado exitosamente' }>(
      { message: 'Orden actualizado exitosamente' },
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

