import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar que sea un PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'El archivo debe ser un PDF' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo no debe superar los 10MB' },
        { status: 400 }
      );
    }

    // Crear un nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `cv-pdfs/${fileName}`;

    // Obtener cliente de Supabase
    const supabase = createServiceClient();

    // Convertir File a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cv-pdfs')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error al subir archivo:', uploadError);
      return NextResponse.json(
        { error: 'Error al subir el archivo', details: uploadError.message },
        { status: 500 }
      );
    }

    // Obtener URL pública del archivo
    const { data: urlData } = supabase.storage
      .from('cv-pdfs')
      .getPublicUrl(filePath);

    return NextResponse.json(
      { 
        message: 'Archivo subido exitosamente',
        url: urlData.publicUrl,
        path: filePath,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error en el servidor:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}

