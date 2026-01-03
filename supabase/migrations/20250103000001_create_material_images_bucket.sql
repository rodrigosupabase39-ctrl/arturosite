-- Create storage bucket for material images
INSERT INTO storage.buckets (id, name, public)
VALUES ('material-images', 'material-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can upload to material-images bucket (for the form submission)
CREATE POLICY "Anyone can upload material images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'material-images'
  );

-- Policy: Anyone can read material images (public bucket)
CREATE POLICY "Anyone can read material images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'material-images'
  );

-- Policy: Admins can delete material images
CREATE POLICY "Admins can delete material images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'material-images' AND
    auth.role() = 'authenticated'
  );

