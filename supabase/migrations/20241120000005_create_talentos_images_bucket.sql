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

