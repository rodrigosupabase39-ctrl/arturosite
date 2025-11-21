import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { altaTalentoSchema, AltaTalentoFormData } from '@/schemas/altaTalentoSchema';
import { ApiError, AltaTalentoResponse } from '@/types/api';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest): Promise<NextResponse<AltaTalentoResponse | ApiError>> {
  try {
    const formData = await request.formData();

    // Extraer las imágenes del FormData
    const imagenes = formData.getAll('imagenes') as File[];
    
    // Crear objeto con todos los datos del formulario (excluyendo las imágenes que se manejan por separado)
    const formDataObj: Record<string, string | number | unknown> = {};
    
    // Extraer los datos del formulario
    const tipo = formData.get('tipo') as string;
    const nombre = formData.get('nombre') as string;
    const videoUrl = formData.get('videoUrl') as string || null;
    const imagenPrincipal = parseInt(formData.get('imagenPrincipal') as string) || 0;
    
    // Extraer los bloques (vienen como JSON string)
    const bloquesStr = formData.get('bloques') as string;
    let bloques: Array<{ tipo: string; contenido: string; order?: number }> = [];
    try {
      bloques = bloquesStr ? JSON.parse(bloquesStr) : [];
      // Asegurar que cada bloque tenga un order
      bloques = bloques.map((bloque, index) => ({
        ...bloque,
        order: bloque.order ?? index,
      }));
    } catch (error) {
      console.error('Error al parsear bloques:', error);
      bloques = [];
    }

    // Validar datos con Zod (sin las imágenes que se validan después)
    const validatedData: AltaTalentoFormData = altaTalentoSchema.parse({
      tipo,
      nombre,
      videoUrl: videoUrl || '',
      imagenes, // Se valida que haya al menos una imagen
      bloques,
      imagenPrincipal,
    });

    const supabase = createServiceClient();

    // Subir las imágenes a Supabase Storage
    const imagenesUrls: string[] = [];
    let imagenPrincipalUrl: string | null = null;

    if (imagenes && imagenes.length > 0) {
      for (let i = 0; i < imagenes.length; i++) {
        const imagen = imagenes[i];
        
        if (imagen && imagen.size > 0) {
          // Validar que sea una imagen válida (PNG, JPG, JPEG, WEBP, GIF)
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

          // Crear un nombre único para el archivo en storage
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

          imagenesUrls.push(urlData.publicUrl);

          // Si es la imagen principal, guardar su URL
          if (i === imagenPrincipal) {
            imagenPrincipalUrl = urlData.publicUrl;
          }
        }
      }
    }

    // Determinar en qué tabla insertar según el tipo
    const tableName = tipo; // actores, actrices, guionistas, directores

    // Obtener el máximo orden actual para asignar el siguiente
    const { data: maxOrderData } = await supabase
      .from(tableName)
      .select('orden')
      .order('orden', { ascending: false })
      .limit(1)
      .single();

    const nextOrden = maxOrderData?.orden !== undefined ? (maxOrderData.orden + 1) : 0;

    // Preparar datos para insertar
    const dbData = {
      nombre: validatedData.nombre,
      video_url: validatedData.videoUrl || null,
      imagen_principal_url: imagenPrincipalUrl,
      imagenes_urls: imagenesUrls,
      bloques: validatedData.bloques || [],
      imagen_principal_index: imagenPrincipal,
      orden: nextOrden,
    };

    // Insertar en la tabla correspondiente
    const { data: insertData, error: insertError } = await supabase
      .from(tableName)
      .insert([dbData])
      .select()
      .single();

    if (insertError) {
      console.error('Error al guardar el talento:', insertError);
      return NextResponse.json<ApiError>(
        { error: 'Error al guardar el talento', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json<AltaTalentoResponse>(
      { message: 'Talent agregado exitosamente', data: insertData },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError' && 'errors' in error) {
      return NextResponse.json<ApiError>(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

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

