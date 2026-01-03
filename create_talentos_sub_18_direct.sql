-- Crear tabla para talentos sub 18
-- Ejecutar este SQL directamente en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS public.talentos_sub_18 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  video_url TEXT,
  imagen_principal_url TEXT,
  imagenes_urls JSONB DEFAULT '[]'::jsonb,
  bloques JSONB DEFAULT '[]'::jsonb,
  imagen_principal_index INTEGER DEFAULT 0,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_talentos_sub_18_nombre ON public.talentos_sub_18(nombre);
CREATE INDEX IF NOT EXISTS idx_talentos_sub_18_created_at ON public.talentos_sub_18(created_at);

-- Enable Row Level Security
ALTER TABLE public.talentos_sub_18 ENABLE ROW LEVEL SECURITY;

-- Policy: Solo admins autenticados pueden leer
DROP POLICY IF EXISTS "Admins can read talentos_sub_18" ON public.talentos_sub_18;
CREATE POLICY "Admins can read talentos_sub_18"
  ON public.talentos_sub_18 FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Solo admins autenticados pueden insertar
DROP POLICY IF EXISTS "Admins can insert talentos_sub_18" ON public.talentos_sub_18;
CREATE POLICY "Admins can insert talentos_sub_18"
  ON public.talentos_sub_18 FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Solo admins autenticados pueden actualizar
DROP POLICY IF EXISTS "Admins can update talentos_sub_18" ON public.talentos_sub_18;
CREATE POLICY "Admins can update talentos_sub_18"
  ON public.talentos_sub_18 FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Solo admins autenticados pueden eliminar
DROP POLICY IF EXISTS "Admins can delete talentos_sub_18" ON public.talentos_sub_18;
CREATE POLICY "Admins can delete talentos_sub_18"
  ON public.talentos_sub_18 FOR DELETE
  USING (auth.role() = 'authenticated');

-- Comentario
COMMENT ON TABLE public.talentos_sub_18 IS 'Tabla para almacenar talentos sub 18';



