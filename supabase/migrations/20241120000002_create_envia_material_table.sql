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

