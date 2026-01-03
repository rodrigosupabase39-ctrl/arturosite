import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ApiError } from '@/types/api';

export interface TalentosStatsResponse {
  actores: number;
  actrices: number;
  guionistas: number;
  directores: number;
  talentosSub18: number;
  material: number; // envia_material
  propuestas: number; // contactos
}

export async function GET(): Promise<NextResponse<TalentosStatsResponse | ApiError>> {
  try {
    const supabase = createServiceClient();

    // Obtener contadores de cada tabla en paralelo
    const [actoresResult, actricesResult, guionistasResult, directoresResult, talentosSub18Result, materialResult, propuestasResult] =
      await Promise.all([
        supabase.from('actores').select('id', { count: 'exact', head: true }),
        supabase.from('actrices').select('id', { count: 'exact', head: true }),
        supabase.from('guionistas').select('id', { count: 'exact', head: true }),
        supabase.from('directores').select('id', { count: 'exact', head: true }),
        supabase.from('talentos_sub_18').select('id', { count: 'exact', head: true }),
        supabase.from('envia_material').select('id', { count: 'exact', head: true }),
        supabase.from('contactos').select('id', { count: 'exact', head: true }),
      ]);

    return NextResponse.json<TalentosStatsResponse>({
      actores: actoresResult.count || 0,
      actrices: actricesResult.count || 0,
      guionistas: guionistasResult.count || 0,
      directores: directoresResult.count || 0,
      talentosSub18: talentosSub18Result.count || 0,
      material: materialResult.count || 0,
      propuestas: propuestasResult.count || 0,
    });
  } catch (error: unknown) {
    console.error('Error al obtener estadísticas:', error);
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Error desconocido';
    return NextResponse.json<ApiError>(
      { error: 'Error al obtener estadísticas', details: errorMessage },
      { status: 500 }
    );
  }
}

