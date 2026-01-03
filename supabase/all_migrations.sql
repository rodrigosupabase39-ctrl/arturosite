-- Create contactos table
CREATE TABLE IF NOT EXISTS public.contactos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contactos_email ON public.contactos(email);
CREATE INDEX IF NOT EXISTS idx_contactos_created_at ON public.contactos(created_at);

-- Enable Row Level Security
ALTER TABLE public.contactos ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated admins can read contactos
CREATE POLICY "Admins can read contactos"
  ON public.contactos
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Anyone can insert contactos (for the contact form)
CREATE POLICY "Anyone can insert contactos"
  ON public.contactos
  FOR INSERT
  WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE public.contactos IS 'Tabla para almacenar mensajes del formulario de contacto';

-- Create envia_material table
CREATE TABLE IF NOT EXISTS public.envia_material (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Información personal
  nombre_completo TEXT NOT NULL,
  apellido TEXT NOT NULL,
  edad TEXT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  nombre_artistico TEXT,
  nombre_adulto_responsable TEXT,
  
  -- Contacto
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  tik_tok TEXT,
  instagram TEXT,
  
  -- Documentación
  nacionalidad TEXT NOT NULL,
  residencia_actual TEXT,
  pasaporte TEXT,
  dni TEXT,
  licencia_conducir TEXT,
  
  -- Características físicas
  altura TEXT,
  peso TEXT,
  contextura TEXT,
  color_pelo TEXT,
  color_ojos TEXT,
  talle_remera TEXT,
  pantalon TEXT,
  calzado TEXT,
  
  -- Información médica
  tatuajes TEXT,
  cicatrices TEXT,
  alergias TEXT,
  
  -- Estilo de vida
  alimentacion TEXT,
  alimentacion_otros TEXT,
  hijos TEXT,
  obra_social TEXT,
  contacto_emergencia TEXT,
  
  -- Habilidades
  instrumentos TEXT,
  canta TEXT,
  idiomas TEXT,
  acento_neutro TEXT,
  deportes TEXT,
  baila TEXT,
  otras_habilidades TEXT,
  
  -- Material
  reel_url TEXT,
  cv_pdf_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_envia_material_email ON public.envia_material(email);
CREATE INDEX IF NOT EXISTS idx_envia_material_created_at ON public.envia_material(created_at);
CREATE INDEX IF NOT EXISTS idx_envia_material_nombre_completo ON public.envia_material(nombre_completo);

-- Enable Row Level Security
ALTER TABLE public.envia_material ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated admins can read envia_material
CREATE POLICY "Admins can read envia_material"
  ON public.envia_material
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Anyone can insert envia_material (for the form)
CREATE POLICY "Anyone can insert envia_material"
  ON public.envia_material
  FOR INSERT
  WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE public.envia_material IS 'Tabla para almacenar formularios de envía tu material';

-- Create storage bucket for CV PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-pdfs', 'cv-pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can upload to cv-pdfs bucket (for the form submission)
CREATE POLICY "Anyone can upload CV PDFs"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'cv-pdfs'
  );

-- Policy: Admins can read CV PDFs
CREATE POLICY "Admins can read CV PDFs"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'cv-pdfs' AND
    auth.role() = 'authenticated'
  );

-- Policy: Admins can delete CV PDFs
CREATE POLICY "Admins can delete CV PDFs"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'cv-pdfs' AND
    auth.role() = 'authenticated'
  );

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

-- Crear storage bucket para imágenes de talentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('talentos-imagenes', 'talentos-imagenes', true) -- Público para URLs públicas
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy para permitir que admins suban imágenes
CREATE POLICY "Admins can upload talent images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'talentos-imagenes');

-- Policy para permitir que admins vean imágenes
CREATE POLICY "Admins can view talent images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'talentos-imagenes');

-- Policy para permitir lectura pública de imágenes (para mostrar en el frontend)
CREATE POLICY "Public can view talent images"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'talentos-imagenes');

-- Policy para permitir que admins eliminen imágenes
CREATE POLICY "Admins can delete talent images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'talentos-imagenes');

-- Asegurar que el bucket talentos-imagenes existe y es público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('talentos-imagenes', 'talentos-imagenes', true, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policies para el bucket (asegurarse de que existan)
-- Policy para permitir lectura pública de imágenes
DROP POLICY IF EXISTS "Public can view talent images" ON storage.objects;
CREATE POLICY "Public can view talent images"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'talentos-imagenes');

-- Policy para permitir que admins suban imágenes
DROP POLICY IF EXISTS "Admins can upload talent images" ON storage.objects;
CREATE POLICY "Admins can upload talent images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'talentos-imagenes');

-- Policy para permitir que admins vean imágenes
DROP POLICY IF EXISTS "Admins can view talent images" ON storage.objects;
CREATE POLICY "Admins can view talent images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'talentos-imagenes');

-- Policy para permitir que admins eliminen imágenes
DROP POLICY IF EXISTS "Admins can delete talent images" ON storage.objects;
CREATE POLICY "Admins can delete talent images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'talentos-imagenes');

-- Agregar campo 'orden' a las tablas de talentos para permitir ordenamiento personalizado

-- Agregar columna 'orden' a la tabla actores
ALTER TABLE public.actores 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;

-- Agregar columna 'orden' a la tabla actrices
ALTER TABLE public.actrices 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;

-- Agregar columna 'orden' a la tabla guionistas
ALTER TABLE public.guionistas 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;

-- Agregar columna 'orden' a la tabla directores
ALTER TABLE public.directores 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;

-- Establecer valores iniciales de 'orden' basados en el orden de creación (created_at)
-- Los más antiguos tendrán menor orden (aparecerán primero)
WITH ranked_actores AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.actores
)
UPDATE public.actores
SET orden = ranked_actores.rn - 1
FROM ranked_actores
WHERE actores.id = ranked_actores.id;

WITH ranked_actrices AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.actrices
)
UPDATE public.actrices
SET orden = ranked_actrices.rn - 1
FROM ranked_actrices
WHERE actrices.id = ranked_actrices.id;

WITH ranked_guionistas AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.guionistas
)
UPDATE public.guionistas
SET orden = ranked_guionistas.rn - 1
FROM ranked_guionistas
WHERE guionistas.id = ranked_guionistas.id;

WITH ranked_directores AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.directores
)
UPDATE public.directores
SET orden = ranked_directores.rn - 1
FROM ranked_directores
WHERE directores.id = ranked_directores.id;

-- Crear tabla para imágenes del slider
CREATE TABLE IF NOT EXISTS public.slider_imagenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imagen_url TEXT NOT NULL,
  alt_text TEXT DEFAULT 'Slider image',
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para ordenar
CREATE INDEX IF NOT EXISTS idx_slider_imagenes_orden ON public.slider_imagenes(orden);
CREATE INDEX IF NOT EXISTS idx_slider_imagenes_created_at ON public.slider_imagenes(created_at);

-- Enable Row Level Security
ALTER TABLE public.slider_imagenes ENABLE ROW LEVEL SECURITY;

-- Policy: Todos pueden leer (público)
CREATE POLICY "Anyone can read slider_imagenes"
  ON public.slider_imagenes FOR SELECT
  USING (true);

-- Policy: Solo admins autenticados pueden insertar
CREATE POLICY "Admins can insert slider_imagenes"
  ON public.slider_imagenes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Solo admins autenticados pueden actualizar
CREATE POLICY "Admins can update slider_imagenes"
  ON public.slider_imagenes FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Solo admins autenticados pueden eliminar
CREATE POLICY "Admins can delete slider_imagenes"
  ON public.slider_imagenes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Comentario
COMMENT ON TABLE public.slider_imagenes IS 'Tabla para almacenar imágenes del slider principal';

-- Create storage bucket for slider images
INSERT INTO storage.buckets (id, name, public)
VALUES ('slider-imagenes', 'slider-imagenes', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Admins can upload slider images
CREATE POLICY "Admins can upload slider images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'slider-imagenes' AND
    auth.role() = 'authenticated'
  );

-- Policy: Anyone can read slider images (public)
CREATE POLICY "Anyone can read slider images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'slider-imagenes'
  );

-- Policy: Admins can delete slider images
CREATE POLICY "Admins can delete slider images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'slider-imagenes' AND
    auth.role() = 'authenticated'
  );

-- Policy: Admins can update slider images
CREATE POLICY "Admins can update slider images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'slider-imagenes' AND
    auth.role() = 'authenticated'
  );

-- Eliminar el campo alt_text de la tabla slider_imagenes si existe
ALTER TABLE public.slider_imagenes DROP COLUMN IF EXISTS alt_text;

