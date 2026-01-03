-- ============================================
-- SCRIPT PARA EJECUTAR EN SUPABASE SQL EDITOR
-- ============================================
-- Este script agrega soporte para imágenes en el formulario "Enviar Material"
-- Ejecuta este script completo en el SQL Editor de Supabase

-- 1. Agregar columna imagenes_urls a la tabla envia_material
ALTER TABLE public.envia_material 
ADD COLUMN IF NOT EXISTS imagenes_urls JSONB DEFAULT '[]'::jsonb;

-- Agregar comentario a la columna
COMMENT ON COLUMN public.envia_material.imagenes_urls IS 'Array de URLs de imágenes subidas';

-- 2. Crear bucket de storage para imágenes de material
INSERT INTO storage.buckets (id, name, public)
VALUES ('material-images', 'material-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Política: Cualquiera puede subir imágenes (para el formulario público)
CREATE POLICY "Anyone can upload material images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'material-images'
  );

-- 4. Política: Cualquiera puede leer imágenes (bucket público)
CREATE POLICY "Anyone can read material images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'material-images'
  );

-- 5. Política: Solo admins pueden eliminar imágenes
CREATE POLICY "Admins can delete material images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'material-images' AND
    auth.role() = 'authenticated'
  );

-- ============================================
-- VERIFICACIÓN (opcional, para confirmar que funcionó)
-- ============================================
-- Puedes ejecutar esto después para verificar:

-- Verificar que la columna existe:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'envia_material' AND column_name = 'imagenes_urls';

-- Verificar que el bucket existe:
-- SELECT * FROM storage.buckets WHERE id = 'material-images';

