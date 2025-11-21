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

