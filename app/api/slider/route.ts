import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ApiError } from '@/types/api';

export interface SliderImagen {
  id: string;
  imagen_url: string;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface SliderListResponse {
  imagenes: SliderImagen[];
}

export async function GET(request: NextRequest): Promise<NextResponse<SliderListResponse | ApiError>> {
  try {
    const supabase = createServiceClient();

    // Obtener todas las imágenes del slider ordenadas por orden
    const { data, error } = await supabase
      .from('slider_imagenes')
      .select('*')
      .order('orden', { ascending: true });

    if (error) {
      console.error('Error al obtener imágenes del slider:', error);
      return NextResponse.json<ApiError>(
        { error: 'Error al obtener imágenes del slider', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<SliderListResponse>({
      imagenes: data || [],
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

export async function POST(request: NextRequest): Promise<NextResponse<{ message: string; imagen: SliderImagen } | ApiError>> {
  try {
    const body = await request.json();
    const { imagen_url, alt_text } = body;

    if (!imagen_url) {
      return NextResponse.json<ApiError>(
        { error: 'URL de imagen requerida' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Obtener el máximo orden actual para asignar el siguiente
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('slider_imagenes')
      .select('orden')
      .order('orden', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxOrderData?.orden !== undefined ? maxOrderData.orden + 1 : 0;

    // Insertar la nueva imagen
    const { data: newImagen, error: insertError } = await supabase
      .from('slider_imagenes')
      .insert({
        imagen_url,
        alt_text: alt_text || 'Slider image',
        orden: nextOrder,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error al crear imagen del slider:', insertError);
      return NextResponse.json<ApiError>(
        { error: 'Error al crear imagen del slider', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json<{ message: 'Imagen del slider creada exitosamente'; imagen: SliderImagen }>(
      { message: 'Imagen del slider creada exitosamente', imagen: newImagen },
      { status: 201 }
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

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<{ message: string } | ApiError>> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiError>(
        { error: 'ID de imagen requerido' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Eliminar la imagen
    const { error: deleteError } = await supabase
      .from('slider_imagenes')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error al eliminar imagen del slider:', deleteError);
      return NextResponse.json<ApiError>(
        { error: 'Error al eliminar imagen del slider', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json<{ message: 'Imagen del slider eliminada exitosamente' }>(
      { message: 'Imagen del slider eliminada exitosamente' },
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

