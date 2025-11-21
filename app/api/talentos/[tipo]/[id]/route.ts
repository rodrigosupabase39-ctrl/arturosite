import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ApiError } from '@/types/api';
import { TalentoItem } from '@/app/api/talentos/list/route';
import { v4 as uuidv4 } from 'uuid';

const validTables = ['actores', 'actrices', 'guionistas', 'directores'];

// GET - Obtener un talento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tipo: string }> }
): Promise<NextResponse<TalentoItem | ApiError>> {
  try {
    const { id, tipo } = await params;

    if (!tipo || !validTables.includes(tipo)) {
      return NextResponse.json<ApiError>(
        { error: 'Tipo de talento inválido. Debe ser: actores, actrices, guionistas o directores' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from(tipo)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener talento:', error);
      return NextResponse.json<ApiError>(
        { error: 'Error al obtener talento', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json<ApiError>(
        { error: 'Talento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json<TalentoItem>(data);
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

// PUT - Actualizar un talento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tipo: string }> }
): Promise<NextResponse<{ message: string; data: TalentoItem } | ApiError>> {
  try {
    const { id, tipo } = await params;

    if (!tipo || !validTables.includes(tipo)) {
      return NextResponse.json<ApiError>(
        { error: 'Tipo de talento inválido. Debe ser: actores, actrices, guionistas o directores' },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    // Similar a POST pero actualizar
    const imagenes = formData.getAll('imagenes') as File[];
    const nombre = formData.get('nombre') as string;
    const videoUrl = formData.get('videoUrl') as string || null;
    const imagenPrincipal = parseInt(formData.get('imagenPrincipal') as string) || 0;
    
    // Extraer los bloques
    const bloquesStr = formData.get('bloques') as string;
    let bloques: Array<{ tipo: string; contenido: string; order?: number }> = [];
    try {
      bloques = bloquesStr ? JSON.parse(bloquesStr) : [];
      bloques = bloques.map((bloque, index) => ({
        ...bloque,
        order: bloque.order ?? index,
      }));
    } catch (error) {
      console.error('Error al parsear bloques:', error);
      bloques = [];
    }

    const supabase = createServiceClient();

    // Obtener datos existentes del talento
    const { data: existingTalento } = await supabase
      .from(tipo)
      .select('imagen_principal_url, imagen_principal_index, imagenes_urls')
      .eq('id', id)
      .single();

    // Obtener las imágenes existentes que no fueron eliminadas
    // El frontend enviará un campo "existingImages" con las URLs que no se eliminaron
    const existingImagesStr = formData.get('existingImages') as string;
    let existingImages: string[] = [];
    try {
      existingImages = existingImagesStr ? JSON.parse(existingImagesStr) : [];
    } catch (error) {
      console.error('Error al parsear existingImages:', error);
      // Si no se envía, obtener todas las existentes de la BD
      existingImages = (existingTalento?.imagenes_urls as string[]) || [];
    }
    
    let finalImagesUrls = [...existingImages];

    // Si hay nuevas imágenes, subirlas
    if (imagenes && imagenes.length > 0) {
      for (let i = 0; i < imagenes.length; i++) {
        const imagen = imagenes[i];
        
        if (imagen && imagen.size > 0) {
          // Validar tipo de imagen
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
          const imagenFileNameLower = imagen.name.toLowerCase();
          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
          const isValidType = allowedTypes.includes(imagen.type.toLowerCase());
          const isValidExtension = allowedExtensions.some(ext => imagenFileNameLower.endsWith(ext));

          if (!isValidType && !isValidExtension) {
            return NextResponse.json<ApiError>(
              { error: `El archivo "${imagen.name}" no es válido. Solo se aceptan: PNG, JPG, JPEG, WEBP o GIF` },
              { status: 400 }
            );
          }

          // Crear nombre único para el archivo
          const fileExt = imagen.name.split('.').pop() || 'jpg';
          const storageFileName = `${tipo}/${uuidv4()}.${fileExt}`;
          const filePath = storageFileName;

          // Convertir File a ArrayBuffer
          const arrayBuffer = await imagen.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          // Subir imagen a Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('talentos-imagenes')
            .upload(filePath, buffer, {
              contentType: imagen.type,
              upsert: false,
            });

          if (uploadError) {
            console.error(`Error al subir imagen ${i + 1}:`, uploadError);
            return NextResponse.json<ApiError>(
              { error: `Error al subir la imagen ${i + 1}`, details: uploadError.message },
              { status: 500 }
            );
          }

          // Obtener URL pública de la imagen
          const { data: urlData } = supabase.storage
            .from('talentos-imagenes')
            .getPublicUrl(filePath);

          finalImagesUrls.push(urlData.publicUrl);
        }
      }
    }

    // Determinar imagen principal
    let imagenPrincipalUrl: string | null = null;
    if (finalImagesUrls.length > 0) {
      const principalIndex = imagenPrincipal >= 0 && imagenPrincipal < finalImagesUrls.length 
        ? imagenPrincipal 
        : 0;
      imagenPrincipalUrl = finalImagesUrls[principalIndex];
    }

    // Preparar datos para actualizar
    const dbData = {
      nombre,
      video_url: videoUrl || null,
      imagen_principal_url: imagenPrincipalUrl || existingTalento?.imagen_principal_url || null,
      imagenes_urls: finalImagesUrls,
      bloques,
      imagen_principal_index: imagenPrincipal >= 0 && imagenPrincipal < finalImagesUrls.length 
        ? imagenPrincipal 
        : (existingTalento?.imagen_principal_index || 0),
    };

    // Actualizar en la tabla correspondiente
    const { data: updateData, error: updateError } = await supabase
      .from(tipo)
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error al actualizar el talento:', updateError);
      return NextResponse.json<ApiError>(
        { error: 'Error al actualizar el talento', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Talento actualizado exitosamente', data: updateData },
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

// DELETE - Eliminar un talento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tipo: string }> }
): Promise<NextResponse<{ message: string } | ApiError>> {
  try {
    const { id, tipo } = await params;

    if (!tipo || !validTables.includes(tipo)) {
      return NextResponse.json<ApiError>(
        { error: 'Tipo de talento inválido. Debe ser: actores, actrices, guionistas o directores' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Eliminar el talento
    const { error: deleteError } = await supabase
      .from(tipo)
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error al eliminar el talento:', deleteError);
      return NextResponse.json<ApiError>(
        { error: 'Error al eliminar el talento', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json<{ message: 'Talento eliminado exitosamente' }>(
      { message: 'Talento eliminado exitosamente' },
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

