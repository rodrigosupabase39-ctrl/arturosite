-- Crear tabla para actores
CREATE TABLE IF NOT EXISTS public.actores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  video_url TEXT,
  imagen_principal_url TEXT, -- URL de la imagen principal
  imagenes_urls JSONB DEFAULT '[]'::jsonb, -- Array de URLs de todas las imágenes
  bloques JSONB DEFAULT '[]'::jsonb, -- Array de bloques con tipo y contenido
  imagen_principal_index INTEGER DEFAULT 0, -- Índice de la imagen principal
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para actrices
CREATE TABLE IF NOT EXISTS public.actrices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  video_url TEXT,
  imagen_principal_url TEXT,
  imagenes_urls JSONB DEFAULT '[]'::jsonb,
  bloques JSONB DEFAULT '[]'::jsonb,
  imagen_principal_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para guionistas
CREATE TABLE IF NOT EXISTS public.guionistas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  video_url TEXT,
  imagen_principal_url TEXT,
  imagenes_urls JSONB DEFAULT '[]'::jsonb,
  bloques JSONB DEFAULT '[]'::jsonb,
  imagen_principal_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para directores
CREATE TABLE IF NOT EXISTS public.directores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  video_url TEXT,
  imagen_principal_url TEXT,
  imagenes_urls JSONB DEFAULT '[]'::jsonb,
  bloques JSONB DEFAULT '[]'::jsonb,
  imagen_principal_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_actores_nombre ON public.actores(nombre);
CREATE INDEX IF NOT EXISTS idx_actores_created_at ON public.actores(created_at);
CREATE INDEX IF NOT EXISTS idx_actrices_nombre ON public.actrices(nombre);
CREATE INDEX IF NOT EXISTS idx_actrices_created_at ON public.actrices(created_at);
CREATE INDEX IF NOT EXISTS idx_guionistas_nombre ON public.guionistas(nombre);
CREATE INDEX IF NOT EXISTS idx_guionistas_created_at ON public.guionistas(created_at);
CREATE INDEX IF NOT EXISTS idx_directores_nombre ON public.directores(nombre);
CREATE INDEX IF NOT EXISTS idx_directores_created_at ON public.directores(created_at);

-- Enable Row Level Security
ALTER TABLE public.actores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actrices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guionistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directores ENABLE ROW LEVEL SECURITY;

-- Policy: Solo admins autenticados pueden leer
CREATE POLICY "Admins can read actores"
  ON public.actores FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read actrices"
  ON public.actrices FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read guionistas"
  ON public.guionistas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read directores"
  ON public.directores FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Solo admins autenticados pueden insertar
CREATE POLICY "Admins can insert actores"
  ON public.actores FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert actrices"
  ON public.actrices FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert guionistas"
  ON public.guionistas FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert directores"
  ON public.directores FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Solo admins autenticados pueden actualizar
CREATE POLICY "Admins can update actores"
  ON public.actores FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update actrices"
  ON public.actrices FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update guionistas"
  ON public.guionistas FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update directores"
  ON public.directores FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Solo admins autenticados pueden eliminar
CREATE POLICY "Admins can delete actores"
  ON public.actores FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete actrices"
  ON public.actrices FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete guionistas"
  ON public.guionistas FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete directores"
  ON public.directores FOR DELETE
  USING (auth.role() = 'authenticated');

-- Comentarios
COMMENT ON TABLE public.actores IS 'Tabla para almacenar actores';
COMMENT ON TABLE public.actrices IS 'Tabla para almacenar actrices';
COMMENT ON TABLE public.guionistas IS 'Tabla para almacenar guionistas';
COMMENT ON TABLE public.directores IS 'Tabla para almacenar directores';

