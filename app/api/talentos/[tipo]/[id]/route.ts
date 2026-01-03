import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ApiError } from '@/types/api';
import { TalentoItem } from '@/app/api/talentos/list/route';
import { v4 as uuidv4 } from 'uuid';
import { generateSlug, generateUniqueSlug } from '@/lib/utils/slug';

const validTables = ['actores', 'actrices', 'guionistas', 'directores', 'talentos-sub-18'];

// Mapeo de tipos de URL a nombres de tabla en la base de datos
const tableNameMap: Record<string, string> = {
  'actores': 'actores',
  'actrices': 'actrices',
  'guionistas': 'guionistas',
  'directores': 'directores',
  'talentos-sub-18': 'talentos_sub_18',
};

// GET - Obtener un talento por slug (nombre)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tipo: string }> }
): Promise<NextResponse<TalentoItem | ApiError>> {
  try {
    const { id: slug, tipo } = await params;

    if (!tipo || !validTables.includes(tipo)) {
      return NextResponse.json<ApiError>(
        { error: 'Tipo de talento inválido. Debe ser: actores, actrices, guionistas, directores o talentos-sub-18' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const tableName = tableNameMap[tipo] || tipo;

    console.log('[TALENTO GET] Buscando por slug:', { slug, tipo, tableName });

    // Buscar por slug primero, si no existe buscar por ID (para compatibilidad)
    let { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    // Si no se encuentra por slug, intentar por ID (compatibilidad con URLs antiguas)
    if (error || !data) {
      console.log('[TALENTO GET] No encontrado por slug, intentando por ID:', { slug, error: error?.message });
      const { data: dataById, error: errorById } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', slug)
        .maybeSingle();
      
      if (!errorById && dataById) {
        data = dataById;
        error = null;
        console.log('[TALENTO GET] Encontrado por ID (compatibilidad):', { slug, nombre: data.nombre });
      } else {
        error = errorById || error;
        console.log('[TALENTO GET] No encontrado ni por slug ni por ID:', { slug, error: error?.message });
      }
    } else {
      console.log('[TALENTO GET] Encontrado por slug:', { slug, nombre: data.nombre });
    }

    if (error || !data) {
      const errorMessage = error?.message || 'Talento no encontrado';
      console.error('[TALENTO GET] Error final:', { slug, tipo, error: errorMessage });
      return NextResponse.json<ApiError>(
        { error: 'Talento no encontrado', details: `No se encontró un talento con el slug o ID: ${slug}. ${errorMessage}` },
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
        { error: 'Tipo de talento inválido. Debe ser: actores, actrices, guionistas, directores o talentos-sub-18' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const tableName = tableNameMap[tipo] || tipo;
    const formData = await request.formData();

    // Similar a POST pero actualizar
    const imagenes = formData.getAll('imagenes') as File[];
    const nombre = formData.get('nombre') as string;
    const videoUrl = formData.get('videoUrl') as string || null;
    const imagenPrincipal = parseInt(formData.get('imagenPrincipal') as string) || 0;
    const imagenPortadaStr = formData.get('imagenPortada') as string;
    const imagenPortada = imagenPortadaStr ? parseInt(imagenPortadaStr) : undefined;
    
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

    // Obtener datos existentes del talento
    const { data: existingTalento } = await supabase
      .from(tableName)
      .select('nombre, slug, imagen_principal_url, imagen_principal_index, imagenes_urls, imagen_portada_url')
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

    // Determinar imagen de portada
    let imagenPortadaUrl: string | null = null;
    if (imagenPortada !== undefined && imagenPortada !== null) {
      // Si se especifica un índice de portada
      if (imagenPortada < existingImages.length) {
        // Es una imagen existente
        imagenPortadaUrl = existingImages[imagenPortada];
      } else if (finalImagesUrls.length > 0) {
        // Es una imagen nueva (el índice se ajusta restando las existentes)
        const portadaIndex = imagenPortada - existingImages.length;
        if (portadaIndex >= 0 && portadaIndex < finalImagesUrls.length) {
          imagenPortadaUrl = finalImagesUrls[portadaIndex];
        }
      }
    } else if (imagenPortada === null) {
      // Si se deselecciona explícitamente, eliminar la portada
      imagenPortadaUrl = null;
    } else if (existingTalento?.imagen_portada_url) {
      // Si no se especifica nueva portada, mantener la existente
      imagenPortadaUrl = existingTalento.imagen_portada_url;
    }

    // Generar slug si el nombre cambió
    let slug = existingTalento?.slug || null;
    if (nombre !== existingTalento?.nombre) {
      const baseSlug = generateSlug(nombre);
      
      // Verificar si el slug ya existe (excluyendo el talento actual)
      const { data: existingSlug } = await supabase
        .from(tableName)
        .select('slug')
        .eq('slug', baseSlug)
        .neq('id', id)
        .single();
      
      if (existingSlug) {
        // Si existe, obtener todos los slugs similares y generar uno único
        const { data: allSlugs } = await supabase
          .from(tableName)
          .select('slug')
          .like('slug', `${baseSlug}%`);
        
        const existingSlugs = (allSlugs || []).map(item => item.slug).filter(Boolean) as string[];
        slug = generateUniqueSlug(nombre, existingSlugs, baseSlug);
      } else {
        slug = baseSlug;
      }
    }

    // Preparar datos para actualizar
    const dbData: any = {
      nombre,
      video_url: videoUrl || null,
      imagen_principal_url: imagenPrincipalUrl || existingTalento?.imagen_principal_url || null,
      imagenes_urls: finalImagesUrls,
      bloques,
      imagen_principal_index: imagenPrincipal >= 0 && imagenPrincipal < finalImagesUrls.length 
        ? imagenPrincipal 
        : (existingTalento?.imagen_principal_index || 0),
    };

    // Solo actualizar el slug si cambió
    if (slug) {
      dbData.slug = slug;
    }

    // Actualizar imagen de portada (solo si se especifica o se deselecciona)
    if (imagenPortadaUrl !== null && imagenPortadaUrl !== undefined) {
      dbData.imagen_portada_url = imagenPortadaUrl;
    } else if (imagenPortada === null) {
      // Si se deselecciona explícitamente, eliminar la portada
      dbData.imagen_portada_url = null;
    }
    // Si imagenPortada es undefined, no actualizamos (mantiene el valor existente en la BD)

    // Actualizar en la tabla correspondiente
    const { data: updateData, error: updateError } = await supabase
      .from(tableName)
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
        { error: 'Tipo de talento inválido. Debe ser: actores, actrices, guionistas, directores o talentos-sub-18' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const tableName = tableNameMap[tipo] || tipo;

    // Eliminar el talento
    const { error: deleteError } = await supabase
      .from(tableName)
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

