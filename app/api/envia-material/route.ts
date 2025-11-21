import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { enviaMaterialSchema, EnviaMaterialFormData } from '@/schemas/enviaMaterialSchema';
import { ApiError, EnviaMaterialResponse } from '@/types/api';

export async function POST(request: NextRequest): Promise<NextResponse<EnviaMaterialResponse | ApiError>> {
  try {
    // Leer FormData desde el request
    const formData = await request.formData();
    
    // Extraer el archivo PDF si existe
    const cvPdfFile = formData.get('cvPdf') as File | null;
    
    // Crear objeto con todos los datos del formulario (excluyendo el archivo)
    const formDataObj: Record<string, string | undefined> = {};
    formData.forEach((value, key) => {
      if (key !== 'cvPdf') {
        // Convertir strings vacíos a undefined para que Zod los maneje como opcionales
        // Excepto reelUrl que puede ser string vacío según el schema
        if (typeof value === 'string' && value.trim() === '') {
          if (key === 'reelUrl') {
            formDataObj[key] = ''; // Mantener string vacío para reelUrl
          } else {
            formDataObj[key] = undefined; // Convertir a undefined para que Zod lo maneje como opcional
          }
        } else {
          formDataObj[key] = value as string;
        }
      }
    });

    // Validar datos con Zod (cvPdf no se valida aquí, se maneja el archivo por separado)
    const validatedData: EnviaMaterialFormData = enviaMaterialSchema.parse(formDataObj);
    
    // Obtener cliente de Supabase con service_role
    const supabase = createServiceClient();
    
    // Subir el PDF a Supabase Storage si existe
    let cvPdfUrl: string | null = null;
    if (cvPdfFile && cvPdfFile.size > 0) {
      // Validar que sea un PDF
      if (cvPdfFile.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'El archivo CV debe ser un PDF' },
          { status: 400 }
        );
      }

      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (cvPdfFile.size > maxSize) {
        return NextResponse.json(
          { error: 'El archivo CV no debe superar los 10MB' },
          { status: 400 }
        );
      }

      // Crear un nombre único para el archivo
      const fileExt = cvPdfFile.name.split('.').pop();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}_${randomStr}.${fileExt}`;
      const filePath = `cv-pdfs/${fileName}`;

      // Convertir File a ArrayBuffer
      const arrayBuffer = await cvPdfFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Subir archivo a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-pdfs')
        .upload(filePath, buffer, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error al subir CV:', uploadError);
        return NextResponse.json(
          { error: 'Error al subir el CV', details: uploadError.message },
          { status: 500 }
        );
      }

      // Obtener URL pública del archivo
      const { data: urlData } = supabase.storage
        .from('cv-pdfs')
        .getPublicUrl(filePath);

      cvPdfUrl = urlData.publicUrl;
    }
    
    // Función auxiliar para convertir strings vacíos o undefined a null
    const toNullIfEmpty = (value: string | undefined): string | null => {
      if (value === undefined || value === null) return null;
      if (typeof value === 'string' && value.trim() === '') return null;
      return value;
    };

    // Mapear los campos del formulario a la estructura de la base de datos
    // Convertir strings vacíos y undefined a null para campos opcionales
    const dbData: Record<string, string | null> = {
      nombre_completo: validatedData.nombreCompleto,
      apellido: validatedData.apellido,
      edad: validatedData.edad,
      fecha_nacimiento: validatedData.fechaNacimiento,
      nombre_artistico: toNullIfEmpty(validatedData.nombreArtistico),
      nombre_adulto_responsable: toNullIfEmpty(validatedData.nombreAdultoResponsable),
      email: validatedData.email,
      whatsapp: validatedData.whatsapp,
      tik_tok: toNullIfEmpty(validatedData.tikTok),
      instagram: toNullIfEmpty(validatedData.instagram),
      nacionalidad: validatedData.nacionalidad,
      residencia_actual: toNullIfEmpty(validatedData.residenciaActual),
      pasaporte: toNullIfEmpty(validatedData.pasaporte),
      dni: toNullIfEmpty(validatedData.dni),
      licencia_conducir: toNullIfEmpty(validatedData.licenciaConducir),
      altura: toNullIfEmpty(validatedData.altura),
      peso: toNullIfEmpty(validatedData.peso),
      contextura: toNullIfEmpty(validatedData.contextura),
      color_pelo: toNullIfEmpty(validatedData.colorPelo),
      color_ojos: toNullIfEmpty(validatedData.colorOjos),
      talle_remera: toNullIfEmpty(validatedData.talleRemera),
      pantalon: toNullIfEmpty(validatedData.pantalon),
      calzado: toNullIfEmpty(validatedData.calzado),
      tatuajes: toNullIfEmpty(validatedData.tatuajes),
      cicatrices: toNullIfEmpty(validatedData.cicatrices),
      alergias: toNullIfEmpty(validatedData.alergias),
      alimentacion: toNullIfEmpty(validatedData.alimentacion),
      alimentacion_otros: toNullIfEmpty(validatedData.alimentacionOtros),
      hijos: toNullIfEmpty(validatedData.hijos),
      obra_social: toNullIfEmpty(validatedData.obraSocial),
      contacto_emergencia: toNullIfEmpty(validatedData.contactoEmergencia),
      instrumentos: toNullIfEmpty(validatedData.instrumentos),
      canta: toNullIfEmpty(validatedData.canta),
      idiomas: toNullIfEmpty(validatedData.idiomas),
      acento_neutro: toNullIfEmpty(validatedData.acentoNeutro),
      deportes: toNullIfEmpty(validatedData.deportes),
      baila: toNullIfEmpty(validatedData.baila),
      otras_habilidades: toNullIfEmpty(validatedData.otrasHabilidades),
      reel_url: validatedData.reelUrl && validatedData.reelUrl.trim() !== '' ? validatedData.reelUrl : null,
      cv_pdf_url: cvPdfUrl,
    };
    
    // Insertar en la tabla envia_material
    const { data, error } = await supabase
      .from('envia_material')
      .insert([dbData])
      .select()
      .single();
    
    if (error) {
      console.error('Error al guardar formulario:', error);
      return NextResponse.json<ApiError>(
        { error: 'Error al guardar el formulario', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json<EnviaMaterialResponse>(
      { message: 'Formulario enviado exitosamente', data },
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

