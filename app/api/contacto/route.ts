import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { contactoSchema, ContactoFormData } from '@/schemas/contactoSchema';
import { ApiError, ContactoResponse } from '@/types/api';

export async function POST(request: NextRequest): Promise<NextResponse<ContactoResponse | ApiError>> {
  try {
    const body = await request.json();
    
    // Validar datos con Zod
    const validatedData: ContactoFormData = contactoSchema.parse(body);
    
    // Obtener cliente de Supabase con service_role (para operaciones públicas)
    const supabase = createServiceClient();
    
    // Insertar en la tabla contactos
    const { data, error } = await supabase
      .from('contactos')
      .insert([
        {
          nombre: validatedData.nombre,
          apellido: validatedData.apellido,
          email: validatedData.email,
          mensaje: validatedData.mensaje,
        },
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error al guardar contacto:', error);
      return NextResponse.json<ApiError>(
        { error: 'Error al guardar el mensaje', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json<ContactoResponse>(
      { message: 'Mensaje enviado exitosamente', data },
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
    return NextResponse.json<ApiError>(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}

