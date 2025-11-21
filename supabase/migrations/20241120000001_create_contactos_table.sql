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

