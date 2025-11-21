import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/schemas/loginSchema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos con Zod
    const validatedData = loginSchema.parse(body);
    
    // Crear cliente de Supabase
    const supabase = await createClient();
    
    // Intentar iniciar sesión con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });
    
    if (error) {
      console.error('Error de autenticación:', error);
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }
    
    if (!data.session) {
      return NextResponse.json(
        { error: 'No se pudo crear la sesión' },
        { status: 401 }
      );
    }
    
    // La sesión se guarda automáticamente en las cookies por el middleware
    return NextResponse.json(
      { 
        message: 'Login exitoso',
        user: data.user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error en el servidor:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}

