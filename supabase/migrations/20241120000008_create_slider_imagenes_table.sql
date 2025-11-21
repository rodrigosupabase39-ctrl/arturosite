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

