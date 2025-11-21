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

