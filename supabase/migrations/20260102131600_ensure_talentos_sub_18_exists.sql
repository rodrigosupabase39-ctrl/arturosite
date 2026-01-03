-- Asegurar que la tabla talentos_sub_18 existe
-- Esta migración verifica y crea la tabla si no existe

DO $$
BEGIN
  -- Verificar si la tabla existe
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'talentos_sub_18'
  ) THEN
    -- Crear tabla para talentos sub 18
    CREATE TABLE public.talentos_sub_18 (
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
    CREATE INDEX idx_talentos_sub_18_nombre ON public.talentos_sub_18(nombre);
    CREATE INDEX idx_talentos_sub_18_created_at ON public.talentos_sub_18(created_at);

    -- Enable Row Level Security
    ALTER TABLE public.talentos_sub_18 ENABLE ROW LEVEL SECURITY;

    -- Policy: Solo admins autenticados pueden leer
    CREATE POLICY "Admins can read talentos_sub_18"
      ON public.talentos_sub_18 FOR SELECT
      USING (auth.role() = 'authenticated');

    -- Policy: Solo admins autenticados pueden insertar
    CREATE POLICY "Admins can insert talentos_sub_18"
      ON public.talentos_sub_18 FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');

    -- Policy: Solo admins autenticados pueden actualizar
    CREATE POLICY "Admins can update talentos_sub_18"
      ON public.talentos_sub_18 FOR UPDATE
      USING (auth.role() = 'authenticated');

    -- Policy: Solo admins autenticados pueden eliminar
    CREATE POLICY "Admins can delete talentos_sub_18"
      ON public.talentos_sub_18 FOR DELETE
      USING (auth.role() = 'authenticated');

    -- Comentario
    COMMENT ON TABLE public.talentos_sub_18 IS 'Tabla para almacenar talentos sub 18';
  END IF;
END $$;



