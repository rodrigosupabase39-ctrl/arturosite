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

