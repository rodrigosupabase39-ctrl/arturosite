import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ApiError } from '@/types/api';
import { v4 as uuidv4 } from 'uuid';
import { SliderImagen } from '../route';

export async function POST(request: NextRequest): Promise<NextResponse<{ message: string; imagen: SliderImagen } | ApiError>> {
  try {
    const formData = await request.formData();
    const imagenFile = formData.get('imagen') as File;

    if (!imagenFile || imagenFile.size === 0) {
      return NextResponse.json<ApiError>(
        { error: 'Imagen requerida' },
        { status: 400 }
      );
    }

    // Validar que sea una imagen válida
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const imagenFileNameLower = imagenFile.name.toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const isValidType = allowedTypes.includes(imagenFile.type.toLowerCase());
    const isValidExtension = allowedExtensions.some(ext => imagenFileNameLower.endsWith(ext));

    if (!isValidType && !isValidExtension) {
      return NextResponse.json<ApiError>(
        { error: `El archivo "${imagenFile.name}" no es válido. Solo se aceptan: PNG, JPG, JPEG, WEBP o GIF` },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Obtener el máximo orden actual para asignar el siguiente
    const { data: maxOrderData } = await supabase
      .from('slider_imagenes')
      .select('orden')
      .order('orden', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxOrderData?.orden !== undefined ? maxOrderData.orden + 1 : 0;

    // Crear un nombre único para el archivo en storage
    const fileExt = imagenFile.name.split('.').pop() || 'jpg';
    const storageFileName = `slider/${uuidv4()}.${fileExt}`;
    const filePath = storageFileName;

    // Convertir File a ArrayBuffer
    const arrayBuffer = await imagenFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir imagen a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('slider-imagenes')
      .upload(filePath, buffer, {
        contentType: imagenFile.type || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error al subir imagen del slider:', uploadError);
      return NextResponse.json<ApiError>(
        { error: 'Error al subir la imagen', details: uploadError.message },
        { status: 500 }
      );
    }

    // Obtener URL pública de la imagen
    const { data: urlData } = supabase.storage
      .from('slider-imagenes')
      .getPublicUrl(filePath);

    const imagenUrl = urlData.publicUrl;

    // Insertar la nueva imagen en la base de datos
    const { data: newImagen, error: insertError } = await supabase
      .from('slider_imagenes')
      .insert({
        imagen_url: imagenUrl,
        orden: nextOrder,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error al crear registro de imagen del slider:', insertError);
      // Intentar eliminar la imagen subida si falla la inserción
      await supabase.storage.from('slider-imagenes').remove([filePath]);
      return NextResponse.json<ApiError>(
        { error: 'Error al crear registro de imagen', details: insertError.message },
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

